import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ShoppingListView from './ShoppingListView';
import AddList from './AddList';
import UpdateItem from './UpdateItem';
import AddInventory from './Inventory/addInventory';
import InventoryUpdateForm from './Inventory/updateInventory';
import InventoryView from './Inventory/viewInventory';
import ConsumptionTable from './Consumption/viewConsumption';
import AddConsumption from './Consumption/addConsumption';
import Navbar from './navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/"  element={<Navbar />}/>
          <Route path='/shoppinglist' element={<ShoppingListView />}/>
          <Route path="/add" element={<AddList />} />
          <Route path="/update/:id" element={<UpdateItem />} />
          <Route path="/addinventory" element={<AddInventory/>}></Route>
          <Route path="/updateinventory/:id" element={<InventoryUpdateForm/>} />
          <Route path="/inventory" element={<AddInventory />} />
          <Route path="/  " element={<InventoryView />} />
          <Route path="/consumption" element={<ConsumptionTable />} />
          <Route path="/addconsumption" element={<AddConsumption />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;