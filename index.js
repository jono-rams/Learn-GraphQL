import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// db
import db from "./db.js";

// types
import { typeDefs } from "./schema.js";

const resolvers = {
  Query: {
    games() {
      return db.games;
    },
    reviews() {
      return db.reviews;
    },
    authors() {
      return db.authors;
    },
    review(_, args) {
      return db.reviews.find((review) => review.id === args.id)
    },
    game(_, args) {
      return db.games.find((game) => game.id === args.id)
    },
    author(_, args) {
      return db.authors.find((author) => author.id === args.id)
    }
  },
  Game: {
    reviews(parent) {
      return db.reviews.filter((review) => review.game_id === parent.id)
    }
  },
  Author: {
    reviews(parent) {
      return db.reviews.filter((review) => review.author_id === parent.id)
    }
  },
  Review: {
    game(parent) {
      return db.games.find((game) => game.id === parent.game_id)
    },
    author(parent) {
      return db.authors.find((author) => author.id === parent.author_id)
    }
  },
  Mutation: {
    deleteGame(_, args) {
      db.games = db.games.filter((game) => game.id !== args.id)
      return db.games
    },
    addGame(_, args) {
      let game = {
        ...args.game,
        id: Math.floor(Math.random() * 10000).toString()
      }
      db.games.push(game)
      return game
    },
    deleteAuthor(_, args) {
      db.authors = db.authors.filter((author) => author.id !== args.id)
      return db.authors
    },
    addAuthor(_, args) {
      let author = {
       ...args.author,
        id: Math.floor(Math.random() * 10000).toString()
      }
      db.authors.push(author)
      return author
    },
    deleteReview(_, args) {
      db.reviews = db.reviews.filter((review) => review.id!== args.id)
      return db.reviews
    },
    addReview(_, args) {
      let review = {
       ...args.review,
        id: Math.floor(Math.random() * 10000).toString()
      }
      db.reviews.push(review)
      return review
    }
  }
};

// server setup
const server = new ApolloServer({
  typeDefs,
  resolvers
})

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 }
});

console.log('Server ready at port', 4000);