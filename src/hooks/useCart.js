import { useState, useEffect } from 'react'
import { db } from '../data/db'
import { useMemo } from "react"

export function useCart () {

    const initialCart = () => {
        const localStorageCart = localStorage.getItem('cart')
    
        return localStorageCart ? JSON.parse(localStorageCart) : []
      }
    
      const [data] = useState(db)
      const [cart, setCart] = useState(initialCart)
    
      const MAX_ITEMS = 5
      const MIN_ITEMS = 1
    
      useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
      }, [cart])
    
      function addToCart(item) {
        const itemExist = cart.findIndex(el => el.id === item.id)
        if (itemExist >= 0) {
          if(cart[itemExist].quantity >= MAX_ITEMS) return
    
          const updatedCart = [...cart]
          updatedCart[itemExist].quantity++
          setCart(updatedCart)
        } else {
          item.quantity = 1
          setCart([...cart, item])
        }
      }
    
      function removeFromCart(id) {
        setCart(prevCart => prevCart.filter(el => el.id !== id))
      }
    
      function increaseQuantity(id) {
        const updatedCart = cart.map(el => {
          if(el.id === id && el.quantity < MAX_ITEMS) {
            return {
              ...el,
              quantity: el.quantity + 1
            }
          }
          return el
        })
        setCart(updatedCart)
      }
    
      function decreaseQuantity(id) {
        const updatedCart = cart.map(el => {
          if(el.id === id && el.quantity > MIN_ITEMS) {
            return {
              ...el,
              quantity: el.quantity - 1
            }
          }
          return el
        })
        setCart(updatedCart)
      }
    
      function clearCart() {
        setCart([])
      }

      const isEmpty = useMemo( () => cart.length === 0, [cart] )
      const cartTotal = useMemo( () => cart.reduce((total, item) => total + (item.quantity * item.price), 0), [cart] )

    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        increaseQuantity,
        clearCart,
        isEmpty,
        cartTotal
    }
}
