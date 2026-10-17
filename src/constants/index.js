export const USER_ROLES = Object.freeze({
  ADMIN: 'ADMIN',
  USER: 'USER',
  DELIVERY_DRIVER: 'DELIVERY_DRIVER'
});

export const ORDER_STATUS = Object.freeze({
  PENDING: 'PENDING', 
  IN_TRANSIT: 'IN_TRANSIT', 
  DELIVERED: 'DELIVERED', 
  CANCELLED: 'CANCELLED'
});

export const ORDER_PRIORITY = Object.freeze({ 
  LOW: 'LOW', 
  NORMAL: 'NORMAL', 
  HIGH: 'HIGH' 
});

  export const DELIVERY_STATUS = Object.freeze({
    PENDING: 'PENDING', 
    ASSIGNED: 'ASSIGNED', 
    DELIVERED: 'DELIVERED', 
    CANCELLED: 'CANCELLED'
});

export const PRODUCT_STATUS = Object.freeze({
  AVAILABLE: 'AVAILABLE',
  OUT_OF_STOCK: 'OUT_OF_STOCK'
});
