# Charity DApp

Charity DApp is a decentralized application that allows users to create, manage, and donate to charitable campaigns. It leverages blockchain technology to ensure transparency and trust in the donation process.

## Features

- **Campaign Management**: Registered charities can create and manage campaigns.
- **Donations**: Users can donate to campaigns using cryptocurrency.
- **Charity Registration**: Organizations can register as verified charities.
- **Admin Panel**: Administrators can review and approve charity registrations.
- **Dashboard**: View statistics and recent activity.

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- A web3-compatible wallet (e.g., MetaMask)
- A blockchain network (e.g., Ethereum or a testnet like Goerli)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd charity-Dapp/UI/Dapp/project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```env
     VITE_APP_CONTRACT_ADDRESS=<smart_contract_address>
     VITE_APP_NETWORK=<network_name>
     ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open the application in your browser:
   ```
   http://localhost:3000
   ```

## Project Structure

- `src/`
  - `components/`: Reusable UI components.
  - `context/`: Context providers for theme and web3.
  - `pages/`: Application pages (e.g., Dashboard, Campaigns).
  - `types/`: TypeScript interfaces and types.
  - `utils/`: Utility functions (e.g., web3 interactions).

## Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the application for production.
- `npm run preview`: Preview the production build.
- `npm run lint`: Run linting checks.

## Smart Contract Integration

The application interacts with a smart contract deployed on the blockchain. Ensure the contract address and network are correctly configured in the `.env` file.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [Web3.js](https://web3js.readthedocs.io/)
