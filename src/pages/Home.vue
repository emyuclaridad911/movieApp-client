<script setup>
import { ref, onMounted } from "vue";
import api from "../api";
import { Notyf } from "notyf";
import { useGlobalStore } from "../stores/global";

const notyf = new Notyf();
const movies = ref([]);
const global = useGlobalStore();

// Fetch movies from backend
async function fetchMovies() {
  try {
    const res = await api.get("/movies/getMovies");
    movies.value = res.data.movies;
  } catch (err) {
    console.error(err);
    notyf.error("Failed to load movies.");
  }
}

onMounted(() => {
  fetchMovies();
});
</script>

<template>
  <div class="container mt-5">
    <div class="text-center mb-4">
      <h1>Welcome to MovieApp!</h1>
      <p v-if="!global.user.token">Login to comment or view full movie details.</p>
    </div>

    <div class="row g-4">
      <div v-for="movie in movies" :key="movie._id" class="col-md-4">
        <div class="card h-100 shadow-sm">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ movie.title }}</h5>
            <h6 class="card-subtitle mb-2 text-muted">
              Directed by {{ movie.director }} ({{ movie.year }})
            </h6>
            <p class="card-text"><strong>Genre:</strong> {{ movie.genre }}</p>
            <p class="card-text">{{ movie.description }}</p>

            <!-- Preview comments -->
            <div v-if="movie.comments && movie.comments.length">
              <strong>Comments:</strong>
              <ul class="mb-2">
                <li v-for="(c, index) in movie.comments.slice(0,2)" :key="c._id">
                  <em>{{ c.user }}:</em> {{ c.text }}
                </li>
              </ul>
              <p v-if="movie.comments.length > 2">...and {{ movie.comments.length - 2 }} more</p>
            </div>

            <!-- Only show View Movie button if logged in -->
            <router-link
              v-if="global.user.token"
              :to="`/movie/${movie._id}`"
              class="btn btn-primary mt-auto"
            >
              View Movie
            </router-link>

            <!-- If not logged in, show message instead of button -->
            <span v-else class="text-muted mt-auto">Login to view details</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  transition: transform 0.2s;
}
.card:hover {
  transform: translateY(-5px);
}
</style>
