export const routes =[
    {path:'/users',target:'http://localhost:4001',auth:false,roles:[],rateLimit: { limit: 10, window: 60 }},
     {path:'/products',target:'http://localhost:4002',auth:true,roles:['admin'],rateLimit: { limit: 30, window: 60 }},
      {path:'/orders',target:'http://localhost:4003',auth:true,roles:['admin','user'],rateLimit: { limit: 20, window: 60 }},
]