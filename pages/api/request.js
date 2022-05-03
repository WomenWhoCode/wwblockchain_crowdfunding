export default function handler(req, res) {
    if (req.method === 'POST') {
      // Process a POST request
      console.log("akanksha");
      console.log(req.body);
      res.status(200).json({ msg: 'Request Success' })
    } else {
      // Handle any other HTTP method
    }
  }