<script setup>
import { ref, reactive, onMounted } from "vue";
import api from "../api";
import { Notyf } from "notyf";

const notyf = new Notyf();
const movies = ref([]);
const showAddForm = ref(false);
const showUpdateForm = ref(false);

// Form fields for adding a new movie
const newMovie = reactive({
  title: "",
  director: "",
  year: "",
  description: "",
  genre: ""
});

// Form fields for updating a movie
const updateMovieData = reactive({
  _id: "",
  title: "",
  director: "",
  year: "",
  description: "",
  genre: ""
});

// Fetch all movies
async function fetchMovies() {
  try {
    const res = await api.get("/movies/getMovies");
    movies.value = res.data.movies;
  } catch (err) {
    console.error(err);
    notyf.error("Failed to fetch movies.");
  }
}

// Add new movie
async function addMovie() {
  try {
    const res = await api.post("/movies/addMovie", newMovie);
    notyf.success("Movie added successfully!");
    movies.value.push(res.data);

    Object.assign(newMovie, { title: "", director: "", year: "", description: "", genre: "" });
    showAddForm.value = false;
  } catch (err) {
    console.error(err);
    notyf.error("Failed to add movie. Are you an admin?");
  }
}

// Prepare update form
function editMovie(movie) {
  Object.assign(updateMovieData, movie);
  showUpdateForm.value = true;
}

// Update movie
async function updateMovie() {
  try {
    const res = await api.patch(`/movies/updateMovie/${updateMovieData._id}`, {
      title: updateMovieData.title,
      director: updateMovieData.director,
      year: updateMovieData.year,
      description: updateMovieData.description,
      genre: updateMovieData.genre
    });

    notyf.success(res.data.message);
    // Refresh movies
    await fetchMovies();
    showUpdateForm.value = false;
  } catch (err) {
    console.error(err);
    notyf.error("Failed to update movie.");
  }
}

// Delete movie
async function deleteMovie(id) {
  if (!confirm("Are you sure you want to delete this movie?")) return;

  try {
    const res = await api.delete(`/movies/deleteMovie/${id}`);
    notyf.success(res.data.message);
    movies.value = movies.value.filter(m => m._id !== id);
  } catch (err) {
    console.error(err);
    notyf.error("Failed to delete movie.");
  }
}

onMounted(fetchMovies);
</script>

<template>
  <div class="container mt-5">
    <h1 class="mb-4">Admin Dashboard</h1>

    <!-- Add Movie Button -->
    <button
      id="addMovie"
      class="btn btn-success mb-3 me-2"
      @click="showAddForm = !showAddForm"
    >
      {{ showAddForm ? "Cancel" : "Add Movie" }}
    </button>

    <!-- Add Movie Form -->
    <div v-if="showAddForm" class="card mb-4 p-3">
      <h5>Add New Movie</h5>
      <div class="row g-3">
        <div class="col-md-6">
          <input v-model="newMovie.title" type="text" class="form-control" placeholder="Title" />
        </div>
        <div class="col-md-6">
          <input v-model="newMovie.director" type="text" class="form-control" placeholder="Director" />
        </div>
        <div class="col-md-3">
          <input v-model="newMovie.year" type="number" class="form-control" placeholder="Year" />
        </div>
        <div class="col-md-3">
          <input v-model="newMovie.genre" type="text" class="form-control" placeholder="Genre" />
        </div>
        <div class="col-12">
          <textarea v-model="newMovie.description" class="form-control" placeholder="Description"></textarea>
        </div>
        <div class="col-12">
          <button class="btn btn-primary" @click="addMovie">Save Movie</button>
        </div>
      </div>
    </div>

    <!-- Update Movie Form -->
    <div v-if="showUpdateForm" class="card mb-4 p-3 border-warning">
      <h5>Update Movie</h5>
      <div class="row g-3">
        <div class="col-md-6">
          <input v-model="updateMovieData.title" type="text" class="form-control" placeholder="Title" />
        </div>
        <div class="col-md-6">
          <input v-model="updateMovieData.director" type="text" class="form-control" placeholder="Director" />
        </div>
        <div class="col-md-3">
          <input v-model="updateMovieData.year" type="number" class="form-control" placeholder="Year" />
        </div>
        <div class="col-md-3">
          <input v-model="updateMovieData.genre" type="text" class="form-control" placeholder="Genre" />
        </div>
        <div class="col-12">
          <textarea v-model="updateMovieData.description" class="form-control" placeholder="Description"></textarea>
        </div>
        <div class="col-12">
          <button class="btn btn-warning me-2" @click="updateMovie">Update Movie</button>
          <button class="btn btn-secondary" @click="showUpdateForm=false">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Movies Table -->
    <table class="table table-striped table-bordered">
      <thead class="table-light">
        <tr>
          <th>Title</th>
          <th>Director</th>
          <th>Year</th>
          <th>Genre</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="movie in movies" :key="movie._id">
          <td>{{ movie.title }}</td>
          <td>{{ movie.director }}</td>
          <td>{{ movie.year }}</td>
          <td>{{ movie.genre }}</td>
          <td>{{ movie.description }}</td>
          <td>
            <button class="btn btn-sm btn-warning me-2" @click="editMovie(movie)">Update</button>
            <button class="btn btn-sm btn-danger" @click="deleteMovie(movie._id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
textarea {
  resize: none;
}
</style>
