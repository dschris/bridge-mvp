const kafka = require('kafka-node');

// Kafka configurations
const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
const producer = new kafka.Producer(client);
const consumer = new kafka.Consumer(
    client,
    [{ topic: 'test-topic', partition: 0 }],
    { autoCommit: false }
);

// Producer: Send a message
producer.on('ready', () => {
    console.log('Kafka Producer is ready');
    const payloads = [{ topic: 'test-topic', messages: 'Hello, Kafka!', partition: 0 }];
    producer.send(payloads, (err, data) => {
        if (err) {
            console.error('Error sending message:', err);
        } else {
            console.log('Message sent:', data);
        }
    });
});

producer.on('error', (err) => {
    console.error('Producer error:', err);
});

// Consumer: Listen for messages
consumer.on('message', (message) => {
    console.log('Received message:', message);

    // Commit the offset after processing
    consumer.commit((err, data) => {
        if (err) {
            console.error('Error committing offset:', err);
        } else {
            console.log('Offset committed:', data);
        }
    });
});
