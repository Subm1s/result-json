const express = require("express");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ["*","http://127.0.0.1:5500","https://puff.transforms5in1.com/","https://puff.transform5in1.com/"],
  })
);

const jsonFilePath = "data.json";

app.post("/data", (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: "Не вказано name або number" });
  }

  let data = [];
  try {
    const { key } = req.query;
    if (
      key !==
      "patP6Gw1aoFHV1y3f.e878cffcfd183dfd47236004d50e7b421c1621584ebf19482a20ecdcc1073d3c"
    ) {
      res
        .status(409)
        .json({ message: "Недостатньо прав для запису інформації" });
    }
    data = JSON.parse(fs.readFileSync(jsonFilePath));
  } catch (error) {
    console.error("Помилка при читанні файлу:", error);
  }

  data.push({ name, number });

  fs.writeFile(jsonFilePath, JSON.stringify(data), (err) => {
    if (err) {
      console.error("Помилка при записі у файл:", err);
      return res.status(500).json({ error: "Помилка при записі у файл" });
    }
    console.log("Дані успішно записано у файл.");
    res.status(200).json({ success: true });
  });
});

app.get("/data", (req, res) => {
  try {
    const { key } = req.query;
    if (
      key ===
      "patP6Gw1aoFHV1y3f.e878cffcfd183dfd47236004d50e7b421c1621584ebf19482a20ecdcc1073d3c"
    ) {
      const data = JSON.parse(fs.readFileSync(jsonFilePath));
      res.json(data);
    } else {
      res
        .status(409)
        .json({ message: "Недостатньо прав для отримання інформації" });
    }
  } catch (error) {
    console.error("Помилка при читанні файлу:", error);
    res.status(500).json({ error: "Помилка при читанні файлу" });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущено на порті ${PORT}`);
});
