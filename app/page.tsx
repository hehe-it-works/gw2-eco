import { startUp } from "@/backgroundServices/instrumentation";
import { getAllDbItemIds, getFullItemData } from "@/db/dbQueries";

export const metadata = {
  title: "GW2-STONKS",
  description: "Guild Wars 2 Economy Calculator",
};

export default async function Home() {
  getFullItemData(1);
  return (
    <div className="landing-page">
      <div className="background-element">
        <div className="nav-background">
          <button className="nav-button-home" onClick={startUp}>
            GW2-STONKS
          </button>
          <button className="nav-button-your-list">Recipes</button>
          <button className="nav-button-your-list">Materials</button>
        </div>
        <div className="search-background">
          <input
            type="text"
            placeholder="Search for material or item..."
            className="material-search-input"
          />
        </div>
        <table className="profit-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Buy Price</th>
              <th>Sell Price</th>
              <th>Profit</th>
            </tr>
          </thead>
          <tbody> </tbody>
        </table>
      </div>
    </div>
  );
}
