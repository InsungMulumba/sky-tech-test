const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/search", async (req, res) => {
  try {
    const resultsPerPage = 10;
    const priorityTerm = "sky mobile";
    const { status, data } = await axios.get(
      "https://help-search-api-prod.herokuapp.com/search",
      { params: req.query }
    );

    let refinedData = [];

    data.results.map((item, index) => {
      refinedData.push({ slug: item.url.split("/").slice(-1)[0], ...item });

      if (
        item.description.toLowerCase().includes(priorityTerm) ||
        item.title.toLowerCase().includes(priorityTerm)
      ) {
        refinedData.unshift(refinedData.splice(index, 1)[0]);
      }
    });

    const totalPages = Math.ceil(refinedData.length / resultsPerPage);

    if (req.query.page) {
      const pageNumber = Number(req.query.page);

      if (pageNumber < 1 || isNaN(pageNumber)) {
        res.status(400);
        res.json({ error: "Invalid Page Number" });
      } else if (pageNumber > totalPages) {
        res.status(400);
        res.json({
          error: `Page Number Out Of Bounds - There are ${totalPages} pages for this search query`,
        });
      }

      refinedData = refinedData.slice((pageNumber - 1) * 10, pageNumber * 10);

      res.status(status);
      res.send(refinedData);
    } else {
      res.status(status);
      res.send(refinedData);
    }
  } catch (err) {
    if (err.isAxiosError) {
      res.status(err.response.status);
    } else {
      throw err;
    }
  }
});

exports.startServer = () => {
  const port = process.env.PORT || "3000";
  app.listen(port, () => console.log(`Listening on :${port}`));
};
