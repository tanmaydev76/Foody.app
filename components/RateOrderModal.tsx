'use client';

import { useState } from 'react';
import { X, Star } from 'lucide-react';
import { useReviews } from '@/context/ReviewsContext';

interface Props {
  orderId: string;
  onClose: () => void;
}

const LABELS = ['', 'Terrible', 'Bad', 'Okay', 'Good', 'Excellent'];

export default function RateOrderModal({ orderId, onClose }: Props) {
  const { addReview } = useReviews();
  const [rating, setRating]   = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [done, setDone]       = useState(false);

  const submit = () => {
    if (!rating) return;
    addReview(orderId, rating, comment.trim());
    setDone(true);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-base rounded-2xl shadow-2xl w-full max-w-sm p-7 flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-fg">
          <X size={18} />
        </button>

        {done ? (
          <div className="text-center py-4 flex flex-col items-center gap-3">
            <div className="text-5xl">🎉</div>
            <h2 className="text-lg font-extrabold">Thanks for your review!</h2>
            <p className="text-muted text-sm">Your feedback helps us improve.</p>
            <button onClick={onClose} className="mt-2 bg-primary text-white font-semibold px-6 py-2.5 rounded-full text-sm hover:bg-primary-dark transition-colors">
              Done
            </button>
          </div>
        ) : (
          <>
            <div>
              <h2 className="text-lg font-extrabold mb-1">Rate your order</h2>
              <p className="text-muted text-sm font-mono">{orderId}</p>
            </div>

            {/* Stars */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onMouseEnter={() => setHovered(s)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => setRating(s)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={36}
                      className={`transition-colors ${s <= (hovered || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted'}`}
                    />
                  </button>
                ))}
              </div>
              <p className={`text-sm font-semibold h-5 transition-colors ${rating ? 'text-yellow-500' : 'text-muted'}`}>
                {LABELS[hovered || rating]}
              </p>
            </div>

            {/* Comment */}
            <div>
              <label className="text-sm font-medium block mb-1.5">Add a comment <span className="text-muted font-normal">(optional)</span></label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us about your experience..."
                rows={3}
                maxLength={300}
                className="w-full px-4 py-3 rounded-xl border border-base bg-base-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <button
              onClick={submit}
              disabled={!rating}
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Submit Review
            </button>
          </>
        )}
      </div>
    </div>
  );
}
