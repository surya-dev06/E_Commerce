# E-commerce Case Study

## Objective
Build a responsive electronics marketplace inspired by the supplied Voltix reference image.

## Problem
Small businesses need a modern store that combines catalogue discovery, secure authentication, online payments and administration without creating a fragmented user experience.

## Solution
A React + TypeScript storefront communicates with Supabase for authentication/database/storage. A Node.js API handles trusted order calculations and Razorpay payment creation/verification.

## User Journey
Home → Category/Search → Product → Cart → Login → Address → Razorpay → Verified Order → Account/Orders.

## Core Features
- Product catalogue
- Search
- Category/price filters
- Product detail
- Cart
- Checkout
- Email verification
- Google OAuth
- Razorpay
- Order history
- Admin role foundation
- Responsive design
- Motion/hover/scroll effects
- Responsive image pipeline

## Security
RLS protects customer-owned rows. Server-side secrets are never sent to the browser. Prices are recalculated from database records before payment creation. Razorpay signatures are verified server-side.

## Performance
Hero media uses eager/high priority loading. Catalogue media is lazy loaded. WebP/JPEG/SVG are supported in the starter; AVIF can be added as the preferred source. Fixed image dimensions reduce layout shift.

## Future Enhancements
- Full admin CRUD
- Coupons
- Reviews
- Wishlist
- Razorpay webhook processing
- Inventory reservation
- Email notifications
- Search indexing
- Analytics
