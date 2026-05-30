export const routes =[
    {path:'/users',target:'http://localhost:4001',auth:false},
     {path:'/products',target:'http://localhost:4002',auth:true},
      {path:'/orders',target:'http://localhost:4003',auth:true},
]