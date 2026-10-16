import React, { useState, useEffect, useCallback } from 'react';
import { IoIosStar, IoIosClose } from 'react-icons/io';
import { LuCheck, LuShieldCheck, LuLoader,LuPencil, LuTrash2, LuChevronDown,LuAlertCircle } from 'react-icons/lu';
import Rating from './Rating';
import { useAuth } from '../context/AuthContext';

const API_BASE = '/api';

const ReviewSection = ({ product }) => {
  const { user, token, isAuthenticated } = useAuth();

  // State
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(product?.rating || 5.0);
  const [totalReviews, setTotalReviews] = useState(product?.reviews || 0);
  const [ratingBreakdownPct, setRatingBreakdownPct] = useState(
    product?.ratingBreakdown || { 5: 82, 4: 12, 3: 4, 2: 1, 1: 1 }
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState('recent');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Modal
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Eligibility
  const [canReview, setCanReview] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [userReview, setUserReview] = useState(null);

  // Edit / Delete
  const [editingReview, setEditingReview] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form
  const [newReview, setNewReview] = useState({ rating: 5, title: '', comment: '' });

  const productId = product?.id;

  const fetchReviews = useCallback(async (sortOpt = sort, pageOpt = 1, append = false) => {
    if (!productId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE}/products/${productId}/reviews?sort=${sortOpt}&page=${pageOpt}&limit=6`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      const data = await res.json();
      if (data.success) {
        if (append) {
          setReviews((prev) => [...prev, ...data.reviews]);
        } else {
          setReviews(data.reviews || []);
        }
        setAverageRating(data.averageRating ?? averageRating);
        setTotalReviews(data.totalReviews ?? totalReviews);
        setRatingBreakdownPct(data.ratingBreakdownPct || ratingBreakdownPct);
        setTotalPages(data.totalPages || 1);
        setHasMore(data.hasMore || false);
        setUserReview(data.userReview || null);
        if (data.userReview) {
          setAlreadyReviewed(true);
          setCanReview(false);
        }
      } else {
        setError(data.message || 'Failed to load reviews');
      }
    } catch (err) {
      setError('Unable to load reviews. Showing cached data.');
      // Fallback to product data
      setReviews(product?.customerReviews || []);
    } finally {
      setLoading(false);
    }
  }, [productId, token]);

  const fetchEligibility = useCallback(async () => {
    if (!isAuthenticated || !token || !productId) return;
    try {
      const res = await fetch(`${API_BASE}/products/${productId}/reviews/eligibility`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setCanReview(data.canReview);
        setAlreadyReviewed(data.alreadyReviewed);
        if (data.existingReview) setUserReview(data.existingReview);
      }
    } catch {
      // Not critical
    }
  }, [isAuthenticated, token, productId]);

  useEffect(() => {
    fetchReviews('recent', 1);
    fetchEligibility();
  }, [productId, token]);

  const handleSortChange = (newSort) => {
    setSort(newSort);
    setPage(1);
    fetchReviews(newSort, 1);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchReviews(sort, nextPage, true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!newReview.title.trim() || !newReview.comment.trim()) {
      setSubmitError('Please fill in all fields.');
      return;
    }
    if (!isAuthenticated) {
      setSubmitError('You must be signed in to submit a review.');
      return;
    }

    setReviewSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newReview),
      });
      const data = await res.json();
      if (data.success) {
        setReviewSubmitted(true);
        setAlreadyReviewed(true);
        setCanReview(false);
        setUserReview(data.review);
        setTimeout(() => {
          setReviewSubmitted(false);
          setIsWriteModalOpen(false);
          setNewReview({ rating: 5, title: '', comment: '' });
          fetchReviews(sort, 1);
        }, 1800);
      } else {
        setSubmitError(data.message || 'Failed to submit review.');
      }
    } catch {
      setSubmitError('Failed to submit review. Please try again.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();
    if (!editingReview) return;
    setReviewSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch(`${API_BASE}/reviews/${editingReview._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: editingReview.rating,
          title: editingReview.title,
          comment: editingReview.comment,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditingReview(null);
        fetchReviews(sort, 1);
      } else {
        setSubmitError(data.message || 'Update failed.');
      }
    } catch {
      setSubmitError('Update failed. Please try again.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const res = await fetch(`${API_BASE}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setDeleteConfirmId(null);
        setAlreadyReviewed(false);
        setCanReview(true);
        setUserReview(null);
        fetchReviews(sort, 1);
      }
    } catch {
      // Handle error silently
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const renderStarPicker = (currentRating, onChange) => (
    <div className="rating-picker">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="rating-star-btn"
          onClick={() => onChange(star)}
          aria-label={`${star} stars`}
        >
          <IoIosStar size={24} color={star <= currentRating ? '#C6A15B' : '#D1D5DB'} />
        </button>
      ))}
      <span className="rating-picker-val">{currentRating} of 5 Stars</span>
    </div>
  );

  return (
    <section id="reviews-section" className="reviews-section">
      <div className="section-header-left">
        <span className="section-label">CLIENT APPRAISALS</span>
        <h2 className="section-heading">Customer Reviews</h2>
      </div>

      {/* Ratings Summary Box */}
      <div className="reviews-summary-card">
        <div className="reviews-score-col">
          <span className="reviews-score-big">{averageRating.toFixed(1)}</span>
          <span className="reviews-score-max">/ 5.0</span>
          <div style={{ marginTop: '8px', marginBottom: '8px' }}>
            <Rating rating={averageRating} size={18} showText={false} />
          </div>
          <span className="reviews-total-count">Based on {totalReviews} verified purchases</span>
          {isAuthenticated && !alreadyReviewed && (
            <button
              type="button"
              className="btn btn-primary btn-write-review"
              onClick={() => setIsWriteModalOpen(true)}
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
            const pct = ratingBreakdownPct[star] || 0;
            return (
              <div key={star} className="review-bar-row">
                <span className="review-bar-label">{star} stars</span>
                <div className="review-bar-track">
                  <div className="review-bar-fill" style={{ width: `${pct}%` }} />
                </div>
                <span className="review-bar-pct">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sort Controls */}
      <div className="reviews-sort-bar">
        <span className="reviews-sort-label">Sort by:</span>
        {['recent', 'highest', 'lowest'].map((opt) => (
          <button
            key={opt}
            type="button"
            className={`reviews-sort-btn ${sort === opt ? 'active' : ''}`}
            onClick={() => handleSortChange(opt)}
          >
            {opt === 'recent' ? 'Most Recent' : opt === 'highest' ? 'Highest Rated' : 'Lowest Rated'}
          </button>
        ))}
      </div>

      {/* Review Cards */}
      {loading && reviews.length === 0 ? (
        <div className="reviews-loading">
          <LuLoader size={22} className="reviews-spinner" color="#C6A15B" />
          <span>Loading appraisals…</span>
        </div>
      ) : error ? (
        <div className="reviews-error-state">
          <LuAlertCircle size={18} />
          <span>{error}</span>
        </div>
      ) : reviews.length === 0 ? (
        <div className="reviews-empty-state">
          <p>No reviews yet. Be the first to share your impressions.</p>
          {isAuthenticated && !alreadyReviewed && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setIsWriteModalOpen(true)}
              style={{ marginTop: '12px' }}
            >
              WRITE THE FIRST REVIEW
            </button>
          )}
        </div>
      ) : (
        <div className="reviews-cards-grid">
          {reviews.map((rev) => {
            const isOwner = user && (rev.userId === user.id || rev.userId === user._id);
            return (
              <div key={rev._id || rev.id} className="review-card">
                <div className="review-card-header">
                  <div className="review-author-group">
                    <div className="review-author-avatar">
                      {(rev.userName || rev.author || 'C').charAt(0)}
                    </div>
                    <div>
                      <div className="review-author-name-row">
                        <strong className="review-author-name">{rev.userName || rev.author}</strong>
                        {(rev.verifiedPurchase || rev.verified) && (
                          <span className="review-verified-badge">
                            <LuShieldCheck size={12} color="#C6A15B" />
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="review-date">
                        {rev.createdAt ? formatDate(rev.createdAt) : (rev.date || '')}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Rating rating={rev.rating} size={14} showText={false} />
                    {isOwner && (
                      <div className="review-owner-actions">
                        <button
                          type="button"
                          className="review-owner-btn"
                          onClick={() => setEditingReview({ ...rev })}
                          title="Edit review"
                        >
                          <LuPencil size={13} />
                        </button>
                        <button
                          type="button"
                          className="review-owner-btn danger"
                          onClick={() => setDeleteConfirmId(rev._id || rev.id)}
                          title="Delete review"
                        >
                          <LuTrash2 size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <h4 className="review-card-title">{rev.title}</h4>
                <p className="review-card-text">{rev.comment}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Load More */}
      {hasMore && !loading && (
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button type="button" className="btn btn-secondary reviews-load-more" onClick={handleLoadMore}>
            <LuChevronDown size={16} /> Load More Reviews
          </button>
        </div>
      )}

      {/* Loading More Indicator */}
      {loading && reviews.length > 0 && (
        <div className="reviews-loading" style={{ marginTop: '16px' }}>
          <LuLoader size={16} className="reviews-spinner" color="#C6A15B" />
          <span>Loading…</span>
        </div>
      )}

      {/* ── Write a Review Modal ── */}
      {isWriteModalOpen && (
        <>
          <div className="drawer-backdrop active" onClick={() => setIsWriteModalOpen(false)} />
          <div className="review-modal">
            <button
              className="review-modal-close"
              onClick={() => setIsWriteModalOpen(false)}
              aria-label="Close modal"
            >
              <IoIosClose size={26} />
            </button>

            <div className="review-modal-header">
              <span className="section-label">SHARE YOUR EXPERIENCE</span>
              <h3 className="review-modal-title">Review the {product?.name}</h3>
            </div>

            {reviewSubmitted ? (
              <div className="review-modal-success">
                <LuCheck size={32} color="#22c55e" />
                <h4>Appraisal Received</h4>
                <p>Thank you for contributing your perspective to the horological community.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="review-form">
                {submitError && (
                  <div className="review-form-error">
                    <LuAlertCircle size={14} /> {submitError}
                  </div>
                )}
                <div className="form-group">
                  <label>Overall Rating</label>
                  {renderStarPicker(newReview.rating, (r) => setNewReview({ ...newReview, rating: r }))}
                </div>
                <div className="form-group">
                  <label>Review Headline</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Exceptional finishing and balance"
                    value={newReview.title}
                    onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                    className="account-input"
                  />
                </div>
                <div className="form-group">
                  <label>Detailed Appraisal</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your impressions of the dial, movement accuracy, wrist presence…"
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    className="account-input"
                  />
                </div>
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '12px' }}
                >
                  {reviewSubmitting ? 'Submitting…' : 'SUBMIT APPRAISAL'}
                </button>
              </form>
            )}
          </div>
        </>
      )}

      {/* ── Edit Review Modal ── */}
      {editingReview && (
        <>
          <div className="drawer-backdrop active" onClick={() => setEditingReview(null)} />
          <div className="review-modal">
            <button className="review-modal-close" onClick={() => setEditingReview(null)} aria-label="Close">
              <IoIosClose size={26} />
            </button>
            <div className="review-modal-header">
              <span className="section-label">EDIT YOUR APPRAISAL</span>
              <h3 className="review-modal-title">Update Review</h3>
            </div>
            <form onSubmit={handleUpdateReview} className="review-form">
              {submitError && (
                <div className="review-form-error">
                  <LuAlertCircle size={14} /> {submitError}
                </div>
              )}
              <div className="form-group">
                <label>Rating</label>
                {renderStarPicker(editingReview.rating, (r) =>
                  setEditingReview({ ...editingReview, rating: r })
                )}
              </div>
              <div className="form-group">
                <label>Headline</label>
                <input
                  type="text"
                  value={editingReview.title}
                  onChange={(e) => setEditingReview({ ...editingReview, title: e.target.value })}
                  className="account-input"
                />
              </div>
              <div className="form-group">
                <label>Your Review</label>
                <textarea
                  rows={4}
                  value={editingReview.comment}
                  onChange={(e) => setEditingReview({ ...editingReview, comment: e.target.value })}
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

      {/* ── Delete Confirm Modal ── */}
      {deleteConfirmId && (
        <>
          <div className="drawer-backdrop active" onClick={() => setDeleteConfirmId(null)} />
          <div className="review-modal" style={{ maxWidth: '380px' }}>
            <div className="review-modal-header">
              <h3 className="review-modal-title" style={{ fontSize: '18px' }}>Delete Review</h3>
            </div>
            <p style={{ marginBottom: '20px', color: '#6b7280', fontSize: '14px' }}>
              Are you sure you want to remove this appraisal? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ flex: 1, background: '#dc2626', boxShadow: 'none' }}
                onClick={() => handleDeleteReview(deleteConfirmId)}
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default ReviewSection;
