## Technology Stack

The project uses BETH stack. I could not have found any better way than this. So unique and cool. Although I had to replace "ElysiaJS" with "FastifyJS" for stability but I plan not to in future!
Learnt from [this awesome video](https://www.youtube.com/watch?v=cpzowDDJj24)

## Getting Started

### Prerequisites

- **NodeJS:** Ensure NodeJS is installed on your machine. You can download it from [NodeJS official website](https://nodejs.org/).

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/azterizm/preebee-beth
   ```
2. **Navigate to the Project Directory:**
   ```bash
   cd preebee-beth
   ```
3. **Install Dependencies:**
   ```bash
   npm install
   ```

### Building the Project

1. **Build the Project:**
   ```bash
   npm run build
   ```

### Running the Project

1. Create app on Google Console then acquire ID, secret, and set callback url to `http://localhost:5002/auth/google/callback`

2. Setup Environmental Variables. Rename `.env.example` to `.env` then populate each variable. You will also put google info here as well.

3. **Start the Application:**
   ```bash
   node build/index.js
   ```

4. **Access the Marketplace:**
   Open your browser and navigate to `http://localhost:5002` to start exploring the marketplace.

## Contribution

Contributions are welcome! If you'd like to contribute to the Marketplace app, please fork the repository and submit a pull request. Follow the contribution guidelines to ensure your changes align with the project goals.


## Contact

For any inquiries, support, or feedback, please reach out or open an issue on the GitHub repository.


