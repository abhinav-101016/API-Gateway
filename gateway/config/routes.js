export const routes =[
    {path:'/users',target:'http://localhost:4001',auth:false,roles:[]},
     {path:'/products',target:'http://localhost:4002',auth:true,roles:['admin']},
      {path:'/orders',target:'http://localhost:4003',auth:true,roles:['admin','user']},
]