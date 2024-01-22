import { ServerRespond } from './DataStreamer';

export interface Row {
  ratio: number;
  upper_bound: number;
  lower_bound: number;
  trigger_alert: boolean;
  price_abc: number;
  price_def: number;
  timestamp: Date;
}

export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]): Row {
    console.log('Received data:', serverResponds);

    // Calculate ratio, upper_bound, lower_bound, and trigger_alert
    const priceABC = serverResponds[0].top_ask && serverResponds[0].top_ask.price || 0;
    const priceDEF = serverResponds[1].top_bid && serverResponds[1].top_bid.price || 0;
    const calculatedRatio = priceABC / priceDEF;
    const calculatedUpperBound = 1.1; // You can adjust this value
    const calculatedLowerBound = 0.99; // You can adjust this value
    const isAlertTriggered = calculatedRatio > calculatedUpperBound || calculatedRatio < calculatedLowerBound;

    console.log('Processed data:', /* Log the processed data */);

    return {
      ratio: calculatedRatio,
      upper_bound: calculatedUpperBound,
      lower_bound: calculatedLowerBound,
      trigger_alert: isAlertTriggered,
      price_abc: priceABC,
      price_def: priceDEF,
      timestamp: serverResponds[0].timestamp,
    };
  }
}
