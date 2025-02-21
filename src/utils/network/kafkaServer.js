const { Kafka } = require("kafkajs");

class KafkaServer {
  constructor(config = {}) {
    const { clientId = "my-app", brokers = ["localhost:9092"], groupId = "test-group" } = config;

    this.kafka = new Kafka({
      clientId,
      brokers,
    });

    this.producer = null;
    this.consumer = null;
    this.groupId = groupId;
  }

  // 初始化生产者
  async initProducer() {
    try {
      this.producer = this.kafka.producer();
      await this.producer.connect();
      console.log("Producer connected successfully");
    } catch (error) {
      console.error("Error connecting producer:", error);
      throw error;
    }
  }

  // 初始化消费者
  async initConsumer() {
    try {
      this.consumer = this.kafka.consumer({ groupId: this.groupId });
      await this.consumer.connect();
      console.log("Consumer connected successfully");
    } catch (error) {
      console.error("Error connecting consumer:", error);
      throw error;
    }
  }

  // 发送消息
  async sendMessage(topicName, messages) {
    try {
      if (!this.producer) {
        throw new Error("Producer not initialized");
      }

      await this.producer.send({
        topicName,
        messages: Array.isArray(messages)
          ? messages.map(msg => ({ value: JSON.stringify(msg) }))
          : [{ value: JSON.stringify(messages) }],
      });
      console.log("Messages sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  // 订阅主题并消费消息
  async subscribe(topics, callback) {
    try {
      if (!this.consumer) {
        throw new Error("Consumer not initialized");
      }

      // 支持字符串或数组形式的主题
      const topicsToSubscribe = Array.isArray(topics) ? topics : [topics];

      // 订阅所有主题
      await Promise.all(
        topicsToSubscribe.map(topic => this.consumer.subscribe({ topic, fromBeginning: true })),
      );

      // 运行消费者
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const value = JSON.parse(message.value.toString());
          await callback(value, topic, partition);
        },
      });

      console.log(`Subscribed to topics: ${topicsToSubscribe.join(", ")}`);
    } catch (error) {
      console.error("Error subscribing to topics:", error);
      throw error;
    }
  }

  // 断开连接
  async disconnect() {
    try {
      if (this.producer) {
        await this.producer.disconnect();
      }
      if (this.consumer) {
        await this.consumer.disconnect();
      }
      console.log("Disconnected from Kafka");
    } catch (error) {
      console.error("Error disconnecting:", error);
      throw error;
    }
  }
}

module.exports = KafkaServer;
