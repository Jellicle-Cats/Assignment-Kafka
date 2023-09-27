const client = require('./client')

const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
	client.getAllMenu(null, (err, data) => {
		if (!err) {
			res.render('menu', {
				results: data.menu
			})
		}
	})
})

const kafka = require('kafka-node')
const kafkaClient = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' })
const Producer = kafka.Producer
const producer = new Producer(kafkaClient)

app.post('/placeorder', (req, res) => {
	var orderItem = {
		id: req.body.id,
		name: req.body.name,
		quantity: req.body.quantity
	}
	const topic = req.body.nation;
	const payload = {
		topic: topic,
		messages: JSON.stringify(orderItem),
		partition:0
	};
	producer.send([payload], (error, result) => {
		if (error) {
		  console.error('Error sending order to Kafka:', error);
		  res.status(500).json({ error: 'Error placing the order' });
		} else {
		  console.log(' [x] %s: Sent at', topic, new Date())
		  console.log(orderItem)
		}
	});
})
//console.log("update Item %s %s %d",updateMenuItem.id, req.body.name, req.body.quantity);

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log('Server running at port %d', PORT)
})

//var data = [{
//   name: '********',
//   company: 'JP Morgan',
//   designation: 'Senior Application Engineer'
//}];
