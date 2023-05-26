<script setup>
import { useStore } from "vuex";
import { computed } from "vue";

const store = useStore();

const closeCart = () => {
  // Triggering a mutation
  store.commit("TOGGLE_CART");
};
const increaseQuantity = (itemId) => {
  store.dispatch("increaseCartItemQuantity", itemId);
};
const decreaseQuantity = (itemId) => {
  store.dispatch("decreaseCartItemQuantity", itemId);
};
const user = computed(() => store.state.user);
const cartItems = computed(() => store.state.user.cart);
const cartTotal = computed(() => store.getters["cartTotal"]);
const removeFromCart = async (itemId) => {
  await store.dispatch("removeFromCart", itemId);
};
</script>

<template>
  <div
    class="fixed top-0 right-0 h-full bg-white z-50 md:w-1/3 w-full transition-all ease-out delay-50 duration-100 px-6 overflow-y-auto border-l-red-500 font-poppins"
  >
    <div className="flex items-center justify-between mt-8 mb-3">
      <h4 className="text-3xl font-bold">Cart review</h4>
      <div
        className="rounded-full p-3 bg-[#f6f7fb]"
        role="button"
        @click="closeCart"
      >
        <BIconXLg />
      </div>
    </div>
    <hr />
    <div className="cart-parent">
      <div v-if="user && cartItems && cartItems.length > 0">
        <section class="h-[60vh] overflow-y-scroll">
          <div className="cart-holder">
            <div
              className="flex justify-between items-center gap-3 mb-3"
              v-for="item in cartItems"
              :key="item.id"
            >
              <div className="w-[25%]">
                <div className="flex mt-2 gap-3 items-center">
                  <div
                    className="image-box w-full p-4 border rounded-md shadow bg-white"
                  >
                    <img
                      :src="item.image"
                      :alt="item.description"
                      className="w-full object-scale-down"
                    />
                  </div>
                </div>
              </div>
              <div className="w-[73%]">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-2/3 w-full">
                    <h4 className="md:text-xl text-base font-semibold">
                      {{ item.title.substring(0, 20) }}
                    </h4>
                    <p className="text-base">${{ item.price }}</p>
                    <button
                      class="rounded-md bg-red-400 p-2 text-white"
                      @click="removeFromCart(item.id)"
                    >
                      Remove
                    </button>
                  </div>
                  <div
                    className="flex items-center justify-between md:w-1/3 w-2/3 pr-3"
                  >
                    <div
                      className="rounded-full p-1 bg-[#f6f7fb]"
                      role="button"
                      @click="decreaseQuantity(item.id)"
                    >
                      <BIconDashLg />
                    </div>
                    <p>{{ item.quantity }}</p>
                    <div
                      className="rounded-full p-1 bg-[#f6f7fb]"
                      role="button"
                      @click="increaseQuantity(item.id)"
                    >
                      <BIconPlusLg />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr />
          </div>
        </section>
        <section className="mt-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-3xl">Subtotal:</h3>
            <h3 className="text-2xl font-semibold">${{ cartTotal }}</h3>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <button
                to="#"
                className="md:px-10 px-5 py-3 bg-blue-900 text-white rounded-md flex items-center justify-center font-semibold"
              >
                View Cart
              </button>
            </div>
            <div>
              <button
                className="md:px-10 px-5 py-3 bg-red-900 text-white rounded-md flex items-center justify-center font-semibold"
              >
                Checkout
              </button>
            </div>
          </div>
        </section>
      </div>
      <div className="h-[60vh] px-4" v-else>
        <img
          src="../assets/images/empty.png"
          alt=""
          className="object-scale-down"
        />
        <p className="text-xl my-3 text-red-500 text-center">
          Your cart is empty
        </p>
      </div>
    </div>
  </div>
</template>
  