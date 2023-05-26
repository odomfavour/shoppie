import { createStore } from "vuex";
import {
  doc,
  addDoc,
  collection,
  setDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import router from "../router";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import axios from "axios";
export default createStore({
  state: {
    products: [],
    cartActive: false,
    user: null,
    error: null,
  },
  mutations: {
    setProducts(state, products) {
      state.products = products;
    },
    TOGGLE_CART(state) {
      state.cartActive = !state.cartActive;
    },
    setError(state, msg) {
      state.error = msg;
    },
    setUser(state, user) {
      state.user = user;
    },
    setCart(state, cartItems) {
      state.user.cart = cartItems;
    },
  },
  actions: {
    async fetchAllProducts({ commit, state }) {
      try {
        state.isLoading = true;
        const data = await axios.get("https://fakestoreapi.com/products", {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        });
        data.data.map((element) => {
          element.price = ((2.2 * element.price) / 100 + element.price).toFixed(
            2
          );
          return element.price;
        });
        commit("setProducts", data.data);
        state.isLoading = false;
      } catch (error) {
        console.error(error);
      }
    },
    async signUpUser({ state, commit }, payload) {
      console.log(payload);
      const auth = getAuth();
      await setPersistence(auth, browserSessionPersistence);

      try {
        state.isLoading = true; // Set loading state to true
        commit("setError", null); // Clear previous error messages

        await createUserWithEmailAndPassword(
          auth,
          payload.email,
          payload.password
        );
        console.log(auth);

        const userRef = collection(db, "users");
        const newUser = {
          id: auth.currentUser.uid,
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
          cart: [],
        };

        await addDoc(userRef, newUser);
        commit("setUser", newUser);
        // Store the user object in local storage or session storage for persistence
        localStorage.setItem("user", JSON.stringify(newUser));

        alert("User registered successfully");
        router.push("/");
        await dispatch("fetchUserItems");
      } catch (error) {
        console.log(error);
        commit("setError", error.message);
      } finally {
        state.isLoading = false; // Set loading state back to false
      }
    },
    async loginUser({ commit, dispatch }, payload) {
      try {
        const auth = getAuth();
        const { email, password } = payload;

        // Sign in the user with the provided email and password
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        const newUser = {
          id: auth.currentUser.uid,
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
          cart: [],
        };
        console.log(newUser);
        // Set the user in the state or store it in localStorage, depending on your preference
        commit("setUser", newUser);
        // Store the user object in local storage or session storage for persistence
        localStorage.setItem("user", JSON.stringify(newUser));

        // Redirect to the desired route after successful login
        // Replace '/dashboard' with the appropriate route path
        router.push("/");
        await dispatch("fetchUserItems");
      } catch (error) {
        console.log(error);
        commit("setError", error.message);
      }
    },
    async addToCart({ state, commit }, payload) {
      try {
        const userRef = doc(db, "users", state.user.id);

        // Check if the item already exists in the cart
        const existingItem = state.user.cart.find(
          (item) => item.id === payload.id
        );

        if (existingItem) {
          // Increase the quantity if the item already exists
          existingItem.quantity += payload.quantity;
        } else {
          // Add the new item to the cart array with default quantity 1
          payload.quantity = 1;
          state.user.cart.push(payload);
        }

        // Update the cart array in the user document
        await setDoc(userRef, { cart: state.user.cart });

        // Commit the updated cart to the state
        commit("setCart", state.user.cart);

        // Display a success message to the user or perform any other actions
        alert("Item added to cart successfully!");
      } catch (error) {
        console.log(error);
        // Handle the error and display an error message to the user or perform any other actions
      }
    },

    async fetchUserItems({ state, commit }) {
      console.log("here", state.user);
      try {
        const userRef = doc(db, "users", state.user.id);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          const cartItems = userData.cart || [];

          // Commit the fetched items to the state
          commit("setCart", cartItems);
        }
      } catch (error) {
        console.log(error);
        // Handle the error and display an error message to the user or perform any other actions
      }
    },
    // Action
    async increaseCartItemQuantity({ state, commit }, itemId) {
      console.log(itemId);
      try {
        const userRef = doc(db, "users", state.user.id);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const cart = userDoc.data().cart;
          const updatedCart = cart.map((item) => {
            if (item.id === itemId) {
              // Increase the quantity of the matching item
              item.quantity += 1;
            }
            return item;
          });
          console.log(cart);

          console.log(updatedCart);

          // Update the cart array in the user document
          await setDoc(userRef, { cart: updatedCart });

          // Commit the updated cart to the state
          commit("setCart", updatedCart);

          // Display a success message to the user or perform any other actions
          alert("Item quantity increased successfully!");
        }
      } catch (error) {
        console.log(error);
        // Handle the error and display an error message to the user or perform any other actions
      }
    },
    // Action
    async decreaseCartItemQuantity({ state, commit }, itemId) {
      try {
        const userRef = doc(db, "users", state.user.id);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const cart = userDoc.data().cart;
          const updatedCart = cart
            .map((item) => {
              if (item.id === itemId) {
                // Decrease the quantity of the matching item
                item.quantity -= 1;

                // Remove the item from the cart if the quantity reaches 0
                if (item.quantity === 0) {
                  return null;
                }
              }
              return item;
            })
            .filter(Boolean); // Filter out any null items

          // Update the cart array in the user document
          await setDoc(userRef, { cart: updatedCart });

          // Commit the updated cart to the state
          commit("setCart", updatedCart);

          // Display a success message to the user or perform any other actions
          alert("Item quantity decreased successfully!");
        }
      } catch (error) {
        console.log(error);
        // Handle the error and display an error message to the user or perform any other actions
      }
    },
    async removeFromCart({ state, commit }, itemId) {
      try {
        const userRef = doc(db, "users", state.user.id);

        // Fetch the user's cart from Firestore
        const userDoc = await getDoc(userRef);
        const cart = userDoc.data().cart || [];

        // Remove the item from the cart
        const updatedCart = cart.filter((item) => item.id !== itemId);

        // Update the cart array in the user document
        await updateDoc(userRef, { cart: updatedCart });

        // Commit the updated cart to the state
        commit("setCart", updatedCart);

        // Display a success message to the user or perform any other actions
        alert("Item removed from cart successfully!");
      } catch (error) {
        console.log(error);
        // Handle the error and display an error message to the user or perform any other actions
      }
    },
    logout({ commit }) {
      const auth = getAuth();
      // Perform Firebase sign out operation
      // For example:
      signOut(auth);

      // Commit null user object to the state
      commit("setUser", { cart: [] });

      // Remove the user object from local storage or session storage
      localStorage.removeItem("newUser");
      router.push("/login");
    },
  },
  getters: {
    cartTotal: (state) => {
      console.log(state.user.cart);
      return state.user.cart.reduce(
        (total, item) =>
          total + parseFloat(item.price) * parseInt(item.quantity),
        0
      );
    },
    isLoggedIn: (state) => state.user !== null,
  },
});
