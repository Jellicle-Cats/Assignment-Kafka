#!/usr/bin/env node

const kafka = require('kafka-node');
const Consumer = kafka.Consumer;
const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
const consumer = new Consumer(
    client,
    [],
    { autoCommit: false }
);
const { basename } = require('path')


const topics = process.argv.slice(2);
if (topics.length < 1) {
  console.warn('Usage: %s [Italian] [Japanese] [Chinese] [Thai] [Indian]', basename(process.argv[1]));
  process.exit(1);
}

consumer.addTopics(topics.map(topic => ({ topic: topic })), (error, added) => {
	if (error) {
	  console.error('Error adding topics to Kafka consumer:', error);
	  process.exit(1);
	}
	console.log('Subscribed to Kafka topics:', added);
});

consumer.on('message', function (message) {
	const secs = message.value.split('.').length - 1;
  
	console.log(` [x] ${message.topic}: Received at`, new Date());
	console.log(JSON.parse(message.value));
  
	setTimeout(function () {
	  console.log(' [x] Done');
	}, secs * 1000);
  });
  
consumer.on('error', function (error) {
	console.error('Kafka consumer error:', error);
});