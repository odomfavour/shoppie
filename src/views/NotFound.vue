<template>
  <div>
    <div class="flex justify-center items-center w-full bg-[#afafaf] min-h-screen ">
      <div class="w-2/5 text-center">
        <h1>404 - Page Not Found</h1>
        <img src="/img/404.jpg" class="w-full" alt="" />
        <p class="text-black text-lg">The page you are looking for does not exist.</p>
        <div class="flex justify-center items-center mt-5">
          <router-link to="/" class="bg-white rounded-md px-6 py-2 text-black font-semibold">Back to Home</router-link>
        </div>
      </div>
    </div>
  </div>
</template>