<script setup>
import { ref, onMounted } from "vue";
import api from "../api";
import { useGlobalStore } from "../stores/global";
import { useRouter } from "vue-router";
import { Notyf } from "notyf";

const movies = ref([]);
const global = useGlobalStore();
const router = useRouter();
const notyf = new Notyf();

async function fetchMovies() {
  try {
    const res = await api.get("/movies/getMovies");
    movies.value = res.data.movies;
  } catch (err) {
    console.error(err);
    notyf.error("Failed to load movies.");
  }
}

function viewMovie(id) {
  router.push({ path: `/movie/${id}` });
}

onMounted(() => {
  if (!global.user.token) {
    notyf.error("You must be logged in to view movies.");
    router.push({ path: "/login" });
    return;
  }
  fetchMovies();
});
</script>

<template>
  <div class="container mt-5">
    <h1 class="mb-4">Movies</h1>

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

            <!-- Show first 3 comments if available -->
            <div v-if="movie.comments && movie.comments.length">
              <strong>Comments:</strong>
              <ul class="mb-2">
                <li v-for="(c, index) in movie.comments.slice(0,3)" :key="c._id">
                  <em>{{ c.user }}:</em> {{ c.text }}
                </li>
              </ul>
              <p v-if="movie.comments.length > 3">...and {{ movie.comments.length - 3 }} more</p>
            </div>

            <button
              class="btn btn-primary mt-auto"
              @click="viewMovie(movie._id)"
            >
              View Movie
            </button>
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
