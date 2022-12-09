// 套用express
const express = require('express')
const app = express()

// 套用express-handlebars
const exphbs = require('express-handlebars')

// 其他變數與資料
const port = 3000
const restaurantList = require('./restaurant.json')

// express-handlebars設定
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))


// route setting
app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurantList.results })
})

app.get('/search', (req, res) => {
  const keywords = req.query.keyword.toLocaleLowerCase().trim()

  const restaurants = restaurantList.results.filter(
    item =>
      item.name.toLocaleLowerCase().includes(keywords) ||
      item.category.includes(keywords))

  res.render('index', { restaurants: restaurants, keyword: req.query.keyword })
})

app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant = restaurantList.results.filter(item => item.id.toString() === req.params.restaurant_id)
  res.render('show', { restaurant: restaurant[0] })
})

// listen and start the express server
app.listen(port, (req, res) => {
  console.log(`Express is listening on http://localhost:${port}`)
})