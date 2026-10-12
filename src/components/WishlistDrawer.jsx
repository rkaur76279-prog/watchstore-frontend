import React from 'react';
import { Link } from 'react-router-dom';
import { IoIosClose } from 'react-icons/io';
import { LuTrash2, LuShoppingBag, LuHeart } from 'react-icons/lu';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';

const WishlistDrawer = () => {
  const { wishlist, isWishlistOpen, setIsWishlistOpen, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (!isWishlistOpen) return null;

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  const handleMoveToBag = (product) => {
    addToCart(product, {
      caseSize: product.caseSizes ? product.caseSizes[0] : product.caseSize,
      strap: product.straps ? product.straps[0] : product.strap
    });
  };

  return (
    <>
      <div
        className="drawer-backdrop active"
        onClick={() => setIsWishlistOpen(false)}
        aria-hidden="true"
      />

      <div className="cart-drawer-container active" role="dialog" aria-modal="true" aria-label="Saved Timepieces">
        <div className="cart-drawer-header">
          <div className="cart-drawer-title-group">
            <h3>Saved Timepieces</h3>
            <span className="cart-drawer-count">({wishlistedProducts.length})</span>
          </div>
          <button
            className="cart-drawer-close"
            onClick={() => setIsWishlistOpen(false)}
            aria-label="Close wishlist drawer"
          >
            <IoIosClose size={28} />
          </button>
        </div>

        <div className="cart-drawer-body">
          {wishlistedProducts.length === 0 ? (
            <div className="cart-empty-state">
              <div className="empty-cart-circle">
                <LuHeart size={32} color="#999999" />
              </div>
              <h4>No timepieces saved yet</h4>
              <p>Curate your personal collection of favored luxury watches while exploring our catalog.</p>
              <Link
                to="/shop"
                className="btn btn-primary"
                onClick={() => setIsWishlistOpen(false)}
                style={{ marginTop: '16px' }}
              >
                EXPLORE WATCHES
              </Link>
            </div>
          ) : (
            <div className="cart-items-list">
              {wishlistedProducts.map((product) => (
                <div key={product.id} className="cart-item-card">
                  <div className="cart-item-image-wrapper">
                    <img src={product.image} alt={product.name} className="cart-item-image" />
                  </div>

                  <div className="cart-item-details">
                    <div className="cart-item-top">
                      <span className="cart-item-brand">{product.brand}</span>
                      <button
                        className="cart-item-remove"
                        onClick={() => toggleWishlist(product.id)}
                        aria-label={`Remove ${product.name} from saved items`}
                      >
                        <LuTrash2 size={15} />
                      </button>
                    </div>

                    <Link
                      to={`/product/${product.id}`}
                      className="cart-item-title"
                      onClick={() => setIsWishlistOpen(false)}
                    >
                      {product.name}
                    </Link>

                    <div className="cart-item-variants">
                      <span>{product.category}</span>
                      <span>•</span>
                      <span>{product.movement}</span>
                    </div>

                    <div className="cart-item-bottom" style={{ marginTop: '10px' }}>
                      <div className="cart-item-price">
                        ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>

                      <button
                        type="button"
                        className="btn btn-primary btn-sm-action"
                        onClick={() => handleMoveToBag(product)}
                      >
                        <LuShoppingBag size={13} />
                        ADD TO BAG
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WishlistDrawer;
