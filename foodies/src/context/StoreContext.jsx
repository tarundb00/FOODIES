import{createContext, useEffect, useState} from "react";
import axios from 'axios';
import { fetchFoodList } from "../service/foodService.js";
import { addToCart, getCartData, removeQtyFromCart } from "../service/cartService.js";
export const StoreContext =createContext(null);

export const StoreContextProvider=(props)=>{

    const [foodList,setFoodList]=useState([]);
    const [quantities,setQuantities]=useState({});
    const [token,setToken]=useState(localStorage.getItem('token') || "");

    const increaseQty=async(foodId)=>{
      try {
        const items = await addToCart(foodId, token);
        if(items){
          setQuantities(items);
          return;
        }
        setQuantities((prev) => ({...prev,[foodId]:(prev[foodId]|| 0)+1}));
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    };

    const decreaseQty=async(foodId)=>{
      try {
        const items = await removeQtyFromCart(foodId, token);
        if(items){
          setQuantities(items);
          return;
        }
        setQuantities((prev)=>({...prev,[foodId]:prev[foodId]>0?prev[foodId]-1:0}));
      } catch (error) {
        console.error('Error removing cart quantity:', error);
      }
    };

    const removeFromCart=async(foodId)=>{
      try {
        const items = await removeQtyFromCart(foodId, token);
        if(items){
          setQuantities(items);
          return;
        }
        setQuantities((prevQuantities)=>{
          const updateQuantities= {...prevQuantities};
          delete updateQuantities[foodId];
          return updateQuantities;
        });
      } catch (error) {
        console.error('Error removing item from cart:', error);
      }
    };
     
    const loadCartData=async(token)=>{
     if(!token){
       setQuantities({});
       return;
     }
     const items=await getCartData(token);
     setQuantities(items);
    }
  
    const contextValue={

        foodList,
        increaseQty,
        decreaseQty,
        quantities,
        removeFromCart,
        token,
        setToken,
        setQuantities,
        loadCartData,

    };

    useEffect(()=>
    {
     async function loadData(){
       const data=await fetchFoodList();
       setFoodList(data);
       if(token){
         await loadCartData(token);
       }
      }
      loadData();
    },[token]);


    return(
  <StoreContext.Provider value={contextValue}>
    {props.children}
    </StoreContext.Provider>
  
    )
}