<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import api from "../api";
import { useGlobalStore } from "../stores/global";
import { Notyf } from "notyf";

const route = useRoute();
const movieId = route.params.id;
const movie = ref(null);
const newComment = ref("");
const global = useGlobalStore();
const notyf = new Notyf();

async function fetchMovie() {
  try {
    const res = await api.get(`/movies/getMovie/${movieId}`);
    movie.value = res.data;
  } catch (err) {
    console.error(err);
    notyf.error("Failed to load movie.");
  }
}

async function addComment() {
  if (!newComment.value.trim()) return;

  try {
    const res = await api.patch(`/movies/addComment/${movieId}`, {
      user: global.user.email,
      text: newComment.value
    });

    movie.value.comments = res.data.updatedMovie.comments;
    newComment.value = "";
    notyf.success("Comment added!");
  } catch (err) {
    console.error(err);
    notyf.error("Failed to add comment.");
  }
}

onMounted(() => {
  if (!global.user.token) {
    notyf.error("You must be logged in to view this movie.");
    return;
  }
  fetchMovie();
});
</script>

<template>
  <div class="container mt-5" v-if="movie">
    <h1 class="mb-3">{{ movie.title }}</h1>
    <h5 class="text-muted">Directed by {{ movie.director }} ({{ movie.year }})</h5>
    <p><strong>Genre:</strong> {{ movie.genre }}</p>
    <p>{{ movie.description }}</p>

    <hr />

    <!-- Comments Section -->
    <h4>Comments ({{ movie.comments.length }})</h4>
    <ul class="list-group mb-3">
      <li v-for="c in movie.comments" :key="c._id" class="list-group-item">
        <strong>{{ c.user }}:</strong> {{ c.text }} 
        <small class="text-muted float-end">{{ new Date(c.date).toLocaleString() }}</small>
      </li>
    </ul>

    <!-- Add Comment -->
    <div class="mb-3">
      <textarea
        v-model="newComment"
        class="form-control"
        placeholder="Write your comment..."
        rows="3"
      ></textarea>
      <button class="btn btn-primary mt-2" @click="addComment">Add Comment</button>
    </div>
  </div>

  <div v-else class="container mt-5">
    <p>Loading movie details...</p>
  </div>
</template>

<style scoped>
textarea {
  resize: none;
}
</style>
