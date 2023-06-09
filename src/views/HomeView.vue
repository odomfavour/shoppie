<script setup>
import MainHeader from "../components/MainHeader.vue";
import CartContainer from "../components/CartContainer.vue";
import { useStore } from "vuex";
import { onMounted, computed } from "vue";

const store = useStore();

// Fetch products on component mount
onMounted(async () => {
  store.dispatch("fetchAllProducts");

  // Check if there is a logged-in user
  const user = store.state.user;
  if (user) {
    await store.dispatch("fetchUserItems");
  }
});
const removeFromCart = async (itemId) => {
  await store.dispatch("removeFromCart", itemId);
};
const addItem = (prod) => {
  store.dispatch("addToCart", prod);
};

// Define the checkCart computed property
const checkCart = computed(() => {
  const user = store.state.user;
  const cartItems = user ? user.cart || [] : [];

  return (itemId) => {
    if (user && cartItems) {
      return cartItems.some((item) => item.id === itemId);
    }
    return false;
  };
});


// Access products from the store
const products = computed(() => store.state.products);
const roundRating = (rate) => Math.round(rate);

const cartActive = computed(() => store.state.cartActive);
</script>

<template>
  <div>
    <MainHeader />

    <!-- <div class="h-[80vh] flex justify-center items-center">
      <div class="text-center">
        <img src="../assets/loading.gif" alt="" />
        <p class="mt-4 text-blue-700">Loading</p>
      </div>
    </div> -->
    <div class="w-11/12 mx-auto my-[100px] font-poppins">
      <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
        <div
          className="border rounded-md drop-shadow-lg px-4 pt-4 pb-20 gap-3 bg-white relative"
          v-for="product in products"
          :key="product.id"
        >
          <img
            :src="product.image"
            alt="product.description"
            className="h-40  w-full object-scale-down"
          />
          <p className="mt-5 text-base font-semibold">
            {{ product.title.substring(0, 30) }}
          </p>
          <p>Price: $ {{ product.price }}</p>
          <p>Rating: {{ roundRating(product.rating.rate) }}</p>
          <div class="flex mt-3">
            <BIconStarFill
              class="text-amber-500"
              v-for="(star, index) in roundRating(product.rating.rate)"
              :key="index"
            />
            <BIconStar
              v-for="(star, index) in 5 - roundRating(product.rating.rate)"
              :key="index"
            />
          </div>
          <div className="flex justify-end mt-3 absolute bottom-3 right-3">
            <!-- <button
                v-if="showAddBtn(product.id)"
                className="p-3 border-2 border-solid rounded-lg bg-gray-50 border-gray-300"
                @click="removeItem(product.id)"
              >
                <BIconCartX />
              </button> -->
            <button
              className="px-3 py-2 border-2 border-solid rounded-lg bg-gray-50 border-red-900 text-red-800 flex gap-2 items-center"
              @click="addItem(product)"
              v-if="!checkCart(product.id)"
            >
              <BIconCart4 />
              <p class="mb-0">Add</p>
            </button>
            <button
              class="rounded-md bg-red-400 p-2 text-white"
              @click="removeFromCart(product.id)"
              v-else
            >
              Remove
            </button>
          </div>
        </div>
      </div>
      <cart-container v-if="cartActive" />
      <!-- <modal-panel /> -->
    </div>
  </div>
</template>
  