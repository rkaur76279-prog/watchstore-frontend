import React, { useState, useEffect, useCallback, useRef } from 'react';
import { IoIosStar, IoIosClose } from 'react-icons/io';
import {
  LuCheck,
  LuShieldCheck,
  LuLoader,
  LuPencil,
  LuTrash2,
  LuChevronDown,
  LuCircleAlert,
} from 'react-icons/lu';
import Rating from './Rating';
import { useAuth } from '../context/AuthContext';

const API_BASE = '/api';
const REVIEWS_PER_PAGE = 6;

const DEFAULT_BREAKDOWN = { 5: 82, 4: 12, 3: 4, 2: 1, 1: 1 };

async function readJsonResponse(response) {
  const text = await response.text();

  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(
      response.status === 404
        ? 'Reviews API route was not found (404). Check that the backend route exists and is deployed.'
        : `The server returned a non-JSON response (HTTP ${response.status}). Check your API/backend configuration.`
    );
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        `Request failed with HTTP ${response.status}.`
    );
  }

  return data;
}

const ReviewSection = ({ product }) => {
  const { user, token, isAuthenticated } = useAuth();
  const productId = product?.id ?? product?._id;

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(
    Number(product?.rating ?? 5)
  );
  const [totalReviews, setTotalReviews] = useState(
    Number(product?.reviews ?? 0)
  );
  const [ratingBreakdownPct, setRatingBreakdownPct] = useState(
    product?.ratingBreakdown || DEFAULT_BREAKDOWN
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sort, setSort] = useState('recent');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const [canReview, setCanReview] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [userReview, setUserReview] = useState(null);

  const [editingReview, setEditingReview] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deletingReview, setDeletingReview] = useState(false);

  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: '',
  });

  const submitTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current);
      }
    };
  }, []);

  const fetchReviews = useCallback(
    async (sortOpt = 'recent', pageOpt = 1, append = false) => {
      if (!productId) {
        setReviews([]);
        setLoading(false);
        setError('Product information is missing, so reviews cannot be loaded.');
        return;
      }

      setLoading(true);
      setError('');

      try {
        const query = new URLSearchParams({
          sort: sortOpt,
          page: String(pageOpt),
          limit: String(REVIEWS_PER_PAGE),
        });

        const response = await fetch(
          `${API_BASE}/products/${encodeURIComponent(productId)}/reviews?${query.toString()}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        const data = await readJsonResponse(response);

        if (data.success !== true) {
          throw new Error(data.message || 'The server could not load reviews.');
        }

        const fetchedReviews = Array.isArray(data.reviews) ? data.reviews : [];

        setReviews((previous) =>
          append ? [...previous, ...fetchedReviews] : fetchedReviews
        );

        setAverageRating((previous) => {
          const value = Number(data.averageRating);
          return data.averageRating != null && Number.isFinite(value)
            ? value
            : previous;
        });

        setTotalReviews((previous) => {
          const value = Number(data.totalReviews);
          return data.totalReviews != null && Number.isFinite(value)
            ? value
            : previous;
        });

        if (data.ratingBreakdownPct && typeof data.ratingBreakdownPct === 'object') {
          setRatingBreakdownPct(data.ratingBreakdownPct);
        }

        setHasMore(Boolean(data.hasMore));
        setUserReview(data.userReview || null);

        if (data.userReview) {
          setAlreadyReviewed(true);
          setCanReview(false);
        } else {
          setAlreadyReviewed(false);
        }
      } catch (err) {
        setError(err?.message || 'Unable to load reviews.');
        if (!append) {
          setReviews(Array.isArray(product?.customerReviews) ? product.customerReviews : []);
        }
      } finally {
        setLoading(false);
      }
    },
    [productId, token, product?.customerReviews]
  );

  const fetchEligibility = useCallback(async () => {
    if (!isAuthenticated || !token || !productId) {
      setCanReview(false);
      setAlreadyReviewed(false);
      setUserReview(null);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/products/${encodeURIComponent(productId)}/reviews/eligibility`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await readJsonResponse(response);

      if (data.success) {
        setCanReview(Boolean(data.canReview));
        setAlreadyReviewed(Boolean(data.alreadyReviewed));
        setUserReview(data.existingReview || data.userReview || null);
      }
    } catch (err) {
      // Keep the review list usable even if the optional eligibility route is unavailable.
      console.warn('Could not check review eligibility:', err?.message || err);
    }
  }, [isAuthenticated, token, productId]);

  useEffect(() => {
    setReviews([]);
    setPage(1);
    setHasMore(false);
    setCanReview(false);
    setAlreadyReviewed(false);
    setUserReview(null);

    fetchReviews('recent', 1, false);
    fetchEligibility();
  }, [fetchReviews, fetchEligibility]);

  const handleSortChange = (newSort) => {
    setSort(newSort);
    setPage(1);
    fetchReviews(newSort, 1, false);
  };

  const handleLoadMore = () => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchReviews(sort, nextPage, true);
  };

  const handleSubmitReview = async (event) => {
    event.preventDefault();
    setSubmitError('');

    if (!productId) {
      setSubmitError('Product information is missing.');
      return;
    }

    if (!newReview.title.trim() || !newReview.comment.trim()) {
      setSubmitError('Please fill in the headline and review fields.');
      return;
    }

    if (!isAuthenticated || !token) {
      setSubmitError('You must be signed in to submit a review.');
      return;
    }

    setReviewSubmitting(true);

    try {
      const response = await fetch(
        `${API_BASE}/products/${encodeURIComponent(productId)}/reviews`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating: Number(newReview.rating),
            title: newReview.title.trim(),
            comment: newReview.comment.trim(),
          }),
        }
      );
      const data = await readJsonResponse(response);

      if (!data.success) {
        throw new Error(data.message || 'Failed to submit review.');
      }

      setReviewSubmitted(true);
      setAlreadyReviewed(true);
      setCanReview(false);
      setUserReview(data.review || null);

      submitTimeoutRef.current = setTimeout(() => {
        setReviewSubmitted(false);
        setIsWriteModalOpen(false);
        setNewReview({ rating: 5, title: '', comment: '' });
        fetchReviews(sort, 1, false);
      }, 1600);
    } catch (err) {
      setSubmitError(err?.message || 'Failed to submit review. Please try again.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleUpdateReview = async (event) => {
    event.preventDefault();
    if (!editingReview?._id && !editingReview?.id) return;

    const reviewId = editingReview._id || editingReview.id;
    setReviewSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch(
        `${API_BASE}/reviews/${encodeURIComponent(reviewId)}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating: Number(editingReview.rating),
            title: String(editingReview.title || '').trim(),
            comment: String(editingReview.comment || '').trim(),
          }),
        }
      );
      const data = await readJsonResponse(response);

      if (!data.success) {
        throw new Error(data.message || 'Update failed.');
      }

      setEditingReview(null);
      setSubmitError('');
      await fetchReviews(sort, 1, false);
    } catch (err) {
      setSubmitError(err?.message || 'Update failed. Please try again.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!reviewId || !token) return;

    setDeletingReview(true);
    setDeleteError('');

    try {
      const response = await fetch(
        `${API_BASE}/reviews/${encodeURIComponent(reviewId)}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await readJsonResponse(response);

      if (!data.success) {
        throw new Error(data.message || 'Could not delete the review.');
      }

      setDeleteConfirmId(null);
      setAlreadyReviewed(false);
      setCanReview(false);
      setUserReview(null);
      await fetchReviews(sort, 1, false);
      await fetchEligibility();
    } catch (err) {
      setDeleteError(err?.message || 'Could not delete the review. Please try again.');
    } finally {
      setDeletingReview(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return String(dateString);

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  };

  const renderStarPicker = (currentRating, onChange) => (
    <div className="rating-picker">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="rating-star-btn"
          onClick={() => onChange(star)}
          aria-label={`${star} ${star === 1 ? 'star' : 'stars'}`}
          aria-pressed={star === currentRating}
        >
          <IoIosStar
            size={24}
            color={star <= currentRating ? '#C6A15B' : '#D1D5DB'}
          />
        </button>
      ))}
      <span className="rating-picker-val">{currentRating} of 5 Stars</span>
    </div>
  );

  const normalizedAverageRating = Number.isFinite(Number(averageRating))
    ? Number(averageRating)
    : 0;

  return (
    <section id="reviews-section" className="reviews-section">
      <div className="section-header-left">
        <span className="section-label">CLIENT APPRAISALS</span>
        <h2 className="section-heading">Customer Reviews</h2>
      </div>

      <div className="reviews-summary-card">
        <div className="reviews-score-col">
          <span className="reviews-score-big">
            {normalizedAverageRating.toFixed(1)}
          </span>
          <span className="reviews-score-max">/ 5.0</span>
          <div style={{ marginTop: '8px', marginBottom: '8px' }}>
            <Rating rating={normalizedAverageRating} size={18} showText={false} />
          </div>
          <span className="reviews-total-count">
            Based on {totalReviews} reviews
          </span>

          {isAuthenticated && canReview && !alreadyReviewed && (
            <button
              type="button"
              className="btn btn-primary btn-write-review"
              onClick={() => {
                setSubmitError('');
                setIsWriteModalOpen(true);
              }}
            >
              WRITE A REVIEW
            </button>
          )}

          {isAuthenticated && alreadyReviewed && (
            <div className="review-already-badge">
              <LuCheck size={13} color="#22c55e" /> You reviewed this timepiece
            </div>
          )}

          {!isAuthenticated && (
            <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '10px' }}>
              Sign in to write a review
            </p>
          )}
        </div>

        <div className="reviews-bars-col">
          {[5, 4, 3, 2, 1].map((star) => {
            const rawPct = Number(ratingBreakdownPct?.[star] || 0);
            const pct = Number.isFinite(rawPct)
              ? Math.min(100, Math.max(0, rawPct))
              : 0;

            return (
              <div key={star} className="review-bar-row">
                <span className="review-bar-label">{star} stars</span>
                <div className="review-bar-track">
                  <div
                    className="review-bar-fill"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="review-bar-pct">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="reviews-sort-bar">
        <span className="reviews-sort-label">Sort by:</span>
        {[
          { value: 'recent', label: 'Most Recent' },
          { value: 'highest', label: 'Highest Rated' },
          { value: 'lowest', label: 'Lowest Rated' },
        ].map((option) => (
          <button
            key={option.value}
            type="button"
            className={`reviews-sort-btn ${sort === option.value ? 'active' : ''}`}
            onClick={() => handleSortChange(option.value)}
            aria-pressed={sort === option.value}
          >
            {option.label}
          </button>
        ))}
      </div>

      {loading && reviews.length === 0 ? (
        <div className="reviews-loading">
          <LuLoader size={22} className="reviews-spinner" color="#C6A15B" />
          <span>Loading reviews…</span>
        </div>
      ) : error ? (
        <div className="reviews-error-state" role="alert">
          <LuCircleAlert size={18} />
          <span>{error}</span>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => fetchReviews(sort, 1, false)}
          >
            Retry
          </button>
        </div>
      ) : reviews.length === 0 ? (
        <div className="reviews-empty-state">
          <p>No reviews yet. Be the first to share your impressions.</p>
          {isAuthenticated && canReview && !alreadyReviewed && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setSubmitError('');
                setIsWriteModalOpen(true);
              }}
              style={{ marginTop: '12px' }}
            >
              WRITE THE FIRST REVIEW
            </button>
          )}
        </div>
      ) : (
        <div className="reviews-cards-grid">
          {reviews.map((review, index) => {
            const reviewId = review._id || review.id || `review-${index}`;
            const reviewUserId =
              typeof review.userId === 'object'
                ? review.userId?._id || review.userId?.id
                : review.userId;
            const currentUserId = user?.id || user?._id;
            const isOwner =
              Boolean(currentUserId) &&
              Boolean(reviewUserId) &&
              String(reviewUserId) === String(currentUserId);
            const authorName = review.userName || review.author || 'Customer';

            return (
              <div key={reviewId} className="review-card">
                <div className="review-card-header">
                  <div className="review-author-group">
                    <div className="review-author-avatar">
                      {authorName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="review-author-name-row">
                        <strong className="review-author-name">{authorName}</strong>
                        {(review.verifiedPurchase || review.verified) && (
                          <span className="review-verified-badge">
                            <LuShieldCheck size={12} color="#C6A15B" />
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="review-date">
                        {review.createdAt
                          ? formatDate(review.createdAt)
                          : review.date || ''}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Rating rating={Number(review.rating) || 0} size={14} showText={false} />
                    {isOwner && (
                      <div className="review-owner-actions">
                        <button
                          type="button"
                          className="review-owner-btn"
                          onClick={() => {
                            setSubmitError('');
                            setEditingReview({ ...review });
                          }}
                          title="Edit review"
                          aria-label="Edit review"
                        >
                          <LuPencil size={13} />
                        </button>
                        <button
                          type="button"
                          className="review-owner-btn danger"
                          onClick={() => {
                            setDeleteError('');
                            setDeleteConfirmId(review._id || review.id);
                          }}
                          title="Delete review"
                          aria-label="Delete review"
                        >
                          <LuTrash2 size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {review.title && <h4 className="review-card-title">{review.title}</h4>}
                <p className="review-card-text">{review.comment}</p>
              </div>
            );
          })}
        </div>
      )}

      {hasMore && !loading && !error && (
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button
            type="button"
            className="btn btn-secondary reviews-load-more"
            onClick={handleLoadMore}
            disabled={loading}
          >
            <LuChevronDown size={16} /> Load More Reviews
          </button>
        </div>
      )}

      {loading && reviews.length > 0 && (
        <div className="reviews-loading" style={{ marginTop: '16px' }}>
          <LuLoader size={16} className="reviews-spinner" color="#C6A15B" />
          <span>Loading…</span>
        </div>
      )}

      {isWriteModalOpen && (
        <>
          <div
            className="drawer-backdrop active"
            onClick={() => {
              if (!reviewSubmitting) setIsWriteModalOpen(false);
            }}
          />
          <div className="review-modal" role="dialog" aria-modal="true" aria-labelledby="write-review-title">
            <button
              type="button"
              className="review-modal-close"
              onClick={() => setIsWriteModalOpen(false)}
              aria-label="Close modal"
              disabled={reviewSubmitting}
            >
              <IoIosClose size={26} />
            </button>

            <div className="review-modal-header">
              <span className="section-label">SHARE YOUR EXPERIENCE</span>
              <h3 id="write-review-title" className="review-modal-title">
                Review the {product?.name || 'product'}
              </h3>
            </div>

            {reviewSubmitted ? (
              <div className="review-modal-success">
                <LuCheck size={32} color="#22c55e" />
                <h4>Review received</h4>
                <p>Thank you for sharing your experience.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="review-form">
                {submitError && (
                  <div className="review-form-error" role="alert">
                    <LuCircleAlert size={14} /> {submitError}
                  </div>
                )}

                <div className="form-group">
                  <label>Overall Rating</label>
                  {renderStarPicker(newReview.rating, (rating) =>
                    setNewReview((previous) => ({ ...previous, rating }))
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="new-review-title">Review Headline</label>
                  <input
                    id="new-review-title"
                    type="text"
                    required
                    maxLength={120}
                    placeholder="e.g. Exceptional finishing and balance"
                    value={newReview.title}
                    onChange={(event) =>
                      setNewReview((previous) => ({
                        ...previous,
                        title: event.target.value,
                      }))
                    }
                    className="account-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="new-review-comment">Detailed Review</label>
                  <textarea
                    id="new-review-comment"
                    required
                    rows={4}
                    maxLength={3000}
                    placeholder="Describe your experience with this product…"
                    value={newReview.comment}
                    onChange={(event) =>
                      setNewReview((previous) => ({
                        ...previous,
                        comment: event.target.value,
                      }))
                    }
                    className="account-input"
                  />
                </div>

                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '12px' }}
                >
                  {reviewSubmitting ? 'Submitting…' : 'SUBMIT REVIEW'}
                </button>
              </form>
            )}
          </div>
        </>
      )}

      {editingReview && (
        <>
          <div
            className="drawer-backdrop active"
            onClick={() => {
              if (!reviewSubmitting) setEditingReview(null);
            }}
          />
          <div className="review-modal" role="dialog" aria-modal="true" aria-labelledby="edit-review-title">
            <button
              type="button"
              className="review-modal-close"
              onClick={() => setEditingReview(null)}
              aria-label="Close edit modal"
              disabled={reviewSubmitting}
            >
              <IoIosClose size={26} />
            </button>

            <div className="review-modal-header">
              <span className="section-label">EDIT YOUR REVIEW</span>
              <h3 id="edit-review-title" className="review-modal-title">Update Review</h3>
            </div>

            <form onSubmit={handleUpdateReview} className="review-form">
              {submitError && (
                <div className="review-form-error" role="alert">
                  <LuCircleAlert size={14} /> {submitError}
                </div>
              )}

              <div className="form-group">
                <label>Rating</label>
                {renderStarPicker(editingReview.rating || 5, (rating) =>
                  setEditingReview((previous) => ({ ...previous, rating }))
                )}
              </div>

              <div className="form-group">
                <label htmlFor="edit-review-title-input">Headline</label>
                <input
                  id="edit-review-title-input"
                  type="text"
                  required
                  maxLength={120}
                  value={editingReview.title || ''}
                  onChange={(event) =>
                    setEditingReview((previous) => ({
                      ...previous,
                      title: event.target.value,
                    }))
                  }
                  className="account-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-review-comment-input">Your Review</label>
                <textarea
                  id="edit-review-comment-input"
                  rows={4}
                  required
                  maxLength={3000}
                  value={editingReview.comment || ''}
                  onChange={(event) =>
                    setEditingReview((previous) => ({
                      ...previous,
                      comment: event.target.value,
                    }))
                  }
                  className="account-input"
                />
              </div>

              <button
                type="submit"
                disabled={reviewSubmitting}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '12px' }}
              >
                {reviewSubmitting ? 'Saving…' : 'SAVE CHANGES'}
              </button>
            </form>
          </div>
        </>
      )}

      {deleteConfirmId && (
        <>
          <div
            className="drawer-backdrop active"
            onClick={() => {
              if (!deletingReview) {
                setDeleteConfirmId(null);
                setDeleteError('');
              }
            }}
          />
          <div className="review-modal" style={{ maxWidth: '380px' }} role="dialog" aria-modal="true" aria-labelledby="delete-review-title">
            <div className="review-modal-header">
              <h3 id="delete-review-title" className="review-modal-title" style={{ fontSize: '18px' }}>
                Delete Review
              </h3>
            </div>

            <p style={{ marginBottom: '20px', color: '#6b7280', fontSize: '14px' }}>
              Are you sure you want to remove this review? This action cannot be undone.
            </p>

            {deleteError && (
              <div className="review-form-error" role="alert" style={{ marginBottom: '16px' }}>
                <LuCircleAlert size={14} /> {deleteError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ flex: 1 }}
                disabled={deletingReview}
                onClick={() => {
                  setDeleteConfirmId(null);
                  setDeleteError('');
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-primary"
                style={{ flex: 1, background: '#dc2626', boxShadow: 'none' }}
                disabled={deletingReview}
                onClick={() => handleDeleteReview(deleteConfirmId)}
              >
                {deletingReview ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default ReviewSection;
