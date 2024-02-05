const cors = require("cors");
const express = require("express");
const app = express();
app.use(cors());
app.use(express.json());
const { fibonacciSequence } = require("./utils/fibonacciSequence.js");
const { primeNumber } = require("./utils/primeNumber.js");

let pokemonList = [];

//Get Catched Pokemon
app.get("/api/v1/phincon/pokemon/catched", async (req, res) => {
  const filteredPokemons = pokemonList.filter(
    (pokemon, pokemonId, array) =>
      pokemonId ===
      array.findIndex((index) => index.pokemonName === pokemon.pokemonName)
  );
  return res.json(filteredPokemons);
});

//Post Catch Pokemon
app.post("/api/v1/phincon/pokemon/catch", async (req, res) => {
  const fiftyProbability = Math.random() < 0.5;
  if (fiftyProbability) {
    pokemonList.push(req.body);
    return res.json({
      status: "Catched",
    });
  }

  return res.json({
    status: "Uncatched",
  });
});

//Delete Catched Pokemon
app.delete("/api/v1/phincon/pokemon/catched/:name", async (req, res) => {
  const pokemonToDelete = req.params.name;

  if (pokemonToDelete) {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    if (primeNumber(randomNumber)) {
      pokemonList = pokemonList.filter(
        (pokemon) => pokemon.pokemonName !== req.params.name
      );
      return res.send(pokemonList);
    }
  }

  return res.sendStatus(400);
});

//Put Rename Pokemon
app.put("/api/v1/phincon/pokemon/rename", async (req, res) => {
  const rename = req.body.pokemon_rename;
  const originalName = req.body.original_name;
  const renameCount = req.body.rename_count;

  pokemonList.forEach((pokemon, pokemonId) => {
    if (pokemon.pokemonName === originalName) {
      pokemon.pokemonName = `${rename} ${
        renameCount === 0 ? renameCount : fibonacciSequence(renameCount - 1)
      }`;
      pokemon.rename_count = renameCount;
    }
  });

  return res.send(pokemonList);
});

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

//Get All Pokemons
app.get("/api/v1/phincon/pokemons", async (req, res) => {
  try {
    const getAllPokemons = await fetch("https://pokeapi.co/api/v2/pokemon");
    const allPokemons = await getAllPokemons.json();

    allPokemons.results.forEach(async (pokemon, pokemonId) => {
      pokemon.img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
        pokemonId + 1
      }.png`;
    });
    res.send(allPokemons);
  } catch (err) {
    console.log(err);
    res.status(500);
  }
});

//Get Pokemon Detail
app.get("/api/v1/phincon/pokemon/:name", async (req, res) => {
  try {
    const apiResponse = await fetch(
      "https://pokeapi.co/api/v2/pokemon/" + req.params.name
    );
    const apiResponseJson = await apiResponse.json();

    res.send(apiResponseJson);
  } catch (err) {
    console.log(err);
    res.status(500);
  }
});

const port = 3001;
app.listen(port, () => {
  console.log("Server has started...");
});
