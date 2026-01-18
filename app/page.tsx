export const metadata = {
  title: "GW2-ECO",
  description: "Guild Wars 2 Economy Calculator",
};

export default async function Home() {
  return (
    <div className="landing-page">
      <div className="background-element">
        <div className="nav-background">
          <button className="nav-button-home">GW2-Eco</button>
          <button className="nav-button">List 1</button>
          <button className="nav-button">List 2</button>
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
