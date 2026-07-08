-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.USERS_T (
  user_id uuid NOT NULL,
  username character varying DEFAULT 'Unknown User'::character varying,
  gender character varying,
  email character varying,
  contact_number character varying,
  balances numeric DEFAULT 0.00,
  security_question1 character varying,
  answer1 character varying,
  security_question2 character varying,
  answer2 character varying,
  role character varying DEFAULT 'Buyer'::character varying,
  available_status boolean,
  user_status character varying DEFAULT 'Active'::character varying,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  avatar character varying DEFAULT 'https://tqccjjrjlqfppgsotszz.supabase.co/storage/v1/object/public/avatars/default.png'::character varying,
  hub_id character varying,
  CONSTRAINT USERS_T_pkey PRIMARY KEY (user_id),
  CONSTRAINT users_t_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT USERS_T_hub_id_fkey FOREIGN KEY (hub_id) REFERENCES public.HUBS_T(hub_id)
);
CREATE TABLE public.MESSAGES_T (
  message_id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  sender_id uuid,
  receiver_id uuid,
  message text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT MESSAGES_T_pkey PRIMARY KEY (message_id),
  CONSTRAINT MESSAGES_T_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.USERS_T(user_id),
  CONSTRAINT MESSAGES_T_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.USERS_T(user_id)
);
CREATE TABLE public.ADDRESSES_T (
  address_id character varying NOT NULL,
  user_id uuid,
  recipient_name character varying,
  recipient_contact_number character varying,
  street character varying,
  city character varying,
  state character varying,
  postcode character varying,
  country character varying,
  is_default boolean,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  lat numeric,
  lng numeric,
  address_status character varying DEFAULT 'Active'::character varying,
  CONSTRAINT ADDRESSES_T_pkey PRIMARY KEY (address_id),
  CONSTRAINT ADDRESSES_T_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.USERS_T(user_id)
);
CREATE TABLE public.BANNERS_T (
  banner_id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid,
  banner_title character varying,
  banner_image_url character varying,
  updated_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT BANNERS_T_pkey PRIMARY KEY (banner_id),
  CONSTRAINT BANNERS_T_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.USERS_T(user_id)
);
CREATE TABLE public.PRODUCTS_T (
  product_id character varying NOT NULL,
  user_id uuid,
  product_name character varying,
  product_description text,
  product_image_url jsonb,
  category character varying,
  price numeric,
  discount bigint,
  stock_quantity bigint,
  product_status character varying DEFAULT 'Active'::character varying,
  updated_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  total_sold bigint DEFAULT '0'::bigint,
  CONSTRAINT PRODUCTS_T_pkey PRIMARY KEY (product_id),
  CONSTRAINT PRODUCTS_T_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.USERS_T(user_id)
);
CREATE TABLE public.PRODUCT_OPTIONS_T (
  option_id character varying NOT NULL,
  product_id character varying,
  option_name character varying,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT PRODUCT_OPTIONS_T_pkey PRIMARY KEY (option_id),
  CONSTRAINT PRODUCT_OPTIONS_T_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.PRODUCTS_T(product_id)
);
CREATE TABLE public.PRODUCT_OPTION_VALUES_T (
  value_id character varying NOT NULL,
  option_id character varying,
  option_value character varying,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT PRODUCT_OPTION_VALUES_T_pkey PRIMARY KEY (value_id),
  CONSTRAINT PRODUCT_OPTION_VALUES_T_option_id_fkey FOREIGN KEY (option_id) REFERENCES public.PRODUCT_OPTIONS_T(option_id)
);
CREATE TABLE public.PRODUCT_VARIANTS_T (
  product_variant_id character varying NOT NULL,
  product_id character varying,
  sku character varying,
  product_variant_price numeric,
  product_variant_stock bigint,
  product_variant_status character varying DEFAULT 'Active'::character varying,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT PRODUCT_VARIANTS_T_pkey PRIMARY KEY (product_variant_id),
  CONSTRAINT PRODUCT_VARIANTS_T_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.PRODUCTS_T(product_id)
);
CREATE TABLE public.VOUCHERS_T (
  voucher_id character varying NOT NULL,
  user_id uuid,
  voucher_name character varying,
  voucher_type character varying,
  discount_value bigint,
  min_spend numeric,
  quantity bigint,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  voucher_status character varying,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT VOUCHERS_T_pkey PRIMARY KEY (voucher_id),
  CONSTRAINT VOUCHERS_T_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.USERS_T(user_id)
);
CREATE TABLE public.USER_VOUCHERS_T (
  user_voucher_id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid,
  voucher_id character varying,
  user_voucher_status character varying DEFAULT 'Available'::character varying,
  used_at timestamp with time zone,
  claimed_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT USER_VOUCHERS_T_pkey PRIMARY KEY (user_voucher_id),
  CONSTRAINT USER_VOUCHERS_T_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.USERS_T(user_id),
  CONSTRAINT USER_VOUCHERS_T_voucher_id_fkey FOREIGN KEY (voucher_id) REFERENCES public.VOUCHERS_T(voucher_id)
);
CREATE TABLE public.ORDERS_T (
  order_id character varying NOT NULL,
  buyer_id uuid,
  seller_id uuid,
  address_id character varying,
  user_voucher_id bigint,
  original_price numeric,
  discount_amount numeric,
  total_amount numeric,
  payment_status character varying,
  order_status character varying,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT ORDERS_T_pkey PRIMARY KEY (order_id),
  CONSTRAINT ORDERS_T_buyer_id_fkey FOREIGN KEY (buyer_id) REFERENCES public.USERS_T(user_id),
  CONSTRAINT ORDERS_T_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.USERS_T(user_id),
  CONSTRAINT ORDERS_T_user_voucher_id_fkey FOREIGN KEY (user_voucher_id) REFERENCES public.USER_VOUCHERS_T(user_voucher_id),
  CONSTRAINT ORDERS_T_address_id_fkey FOREIGN KEY (address_id) REFERENCES public.ADDRESSES_T(address_id)
);
CREATE TABLE public.ORDER_ITEMS_T (
  order_item_id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  order_id character varying,
  product_variant_id character varying,
  quantity bigint,
  unit_price numeric,
  subtotal numeric,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT ORDER_ITEMS_T_pkey PRIMARY KEY (order_item_id),
  CONSTRAINT ORDER_ITEMS_T_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.ORDERS_T(order_id),
  CONSTRAINT ORDER_ITEMS_T_product_variant_id_fkey FOREIGN KEY (product_variant_id) REFERENCES public.PRODUCT_VARIANTS_T(product_variant_id)
);
CREATE TABLE public.ORDER_TRANSACTIONS_T (
  order_transaction_id character varying NOT NULL,
  order_id character varying,
  amount numeric,
  order_transaction_status character varying,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT ORDER_TRANSACTIONS_T_pkey PRIMARY KEY (order_transaction_id),
  CONSTRAINT ORDER_TRANSACTIONS_T_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.ORDERS_T(order_id)
);
CREATE TABLE public.HUBS_T (
  hub_id character varying NOT NULL,
  hub_name character varying,
  hub_location text,
  lng numeric,
  lat numeric,
  capacity bigint,
  hub_status character varying,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT HUBS_T_pkey PRIMARY KEY (hub_id)
);
CREATE TABLE public.SHIPPING_T (
  shipping_id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  order_id character varying,
  courier_id uuid,
  hub_id character varying,
  admin_id uuid,
  delivery_type character varying,
  delivery_fee numeric,
  shipping_status character varying,
  shipped_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT SHIPPING_T_pkey PRIMARY KEY (shipping_id),
  CONSTRAINT SHIPPING_T_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.USERS_T(user_id),
  CONSTRAINT SHIPPING_T_hub_id_fkey FOREIGN KEY (hub_id) REFERENCES public.HUBS_T(hub_id),
  CONSTRAINT SHIPPING_T_courier_id_fkey FOREIGN KEY (courier_id) REFERENCES public.USERS_T(user_id),
  CONSTRAINT SHIPPING_T_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.ORDERS_T(order_id)
);
CREATE TABLE public.REFUNDS_T (
  refund_id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  order_id character varying,
  refund_subject character varying,
  evidences jsonb,
  refund_description text,
  seller_remarks text,
  admin_remarks text,
  seller_status character varying,
  refunded_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  admin_status character varying,
  CONSTRAINT REFUNDS_T_pkey PRIMARY KEY (refund_id),
  CONSTRAINT REFUNDS_T_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.ORDERS_T(order_id)
);
CREATE TABLE public.REVIEWS_T (
  review_id character varying NOT NULL,
  order_id character varying,
  user_id uuid,
  product_rating numeric,
  comment text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  product_id character varying,
  CONSTRAINT REVIEWS_T_pkey PRIMARY KEY (review_id),
  CONSTRAINT REVIEWS_T_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.USERS_T(user_id),
  CONSTRAINT REVIEWS_T_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.ORDERS_T(order_id),
  CONSTRAINT REVIEWS_T_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.PRODUCTS_T(product_id)
);
CREATE TABLE public.SUPPORTS_T (
  support_id character varying NOT NULL,
  reporter_id uuid,
  target_product_id character varying,
  target_seller_id uuid,
  handle_admin_id uuid,
  support_type character varying,
  support_description text,
  support_status character varying,
  solved_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  admin_remarks text,
  CONSTRAINT SUPPORTS_T_pkey PRIMARY KEY (support_id),
  CONSTRAINT SUPPORTS_T_handle_admin_id_fkey FOREIGN KEY (handle_admin_id) REFERENCES public.USERS_T(user_id),
  CONSTRAINT SUPPORTS_T_target_seller_id_fkey FOREIGN KEY (target_seller_id) REFERENCES public.USERS_T(user_id),
  CONSTRAINT SUPPORTS_T_target_product_id_fkey FOREIGN KEY (target_product_id) REFERENCES public.PRODUCTS_T(product_id),
  CONSTRAINT SUPPORTS_T_reporter_id_fkey FOREIGN KEY (reporter_id) REFERENCES public.USERS_T(user_id)
);
CREATE TABLE public.WALLET_TRANSACTIONS_T (
  wallet_transaction_id character varying NOT NULL,
  user_id uuid,
  transaction_type character varying,
  direction character varying,
  payment_method character varying,
  amount numeric,
  wallet_transaction_status character varying DEFAULT 'Success'::character varying,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT WALLET_TRANSACTIONS_T_pkey PRIMARY KEY (wallet_transaction_id),
  CONSTRAINT WALLET_TRANSACTIONS_T_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.USERS_T(user_id)
);
CREATE TABLE public.CART_ITEMS_T (
  cart_item_id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid,
  product_variant_id character varying,
  quantity bigint,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT CART_ITEMS_T_pkey PRIMARY KEY (cart_item_id),
  CONSTRAINT CART_ITEMS_T_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.USERS_T(user_id),
  CONSTRAINT CART_ITEMS_T_product_variant_id_fkey FOREIGN KEY (product_variant_id) REFERENCES public.PRODUCT_VARIANTS_T(product_variant_id)
);