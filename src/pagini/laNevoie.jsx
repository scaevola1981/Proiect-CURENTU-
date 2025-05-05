// import { useState } from 'react';
// import { Package, Factory, ShoppingBag, Archive, AlertTriangle, Home, Bell, Settings, Menu } from 'lucide-react';

// export default function HomePage() {
//   const [notifications, setNotifications] = useState(3);
  
//   // Date pentru Camera 1: Materii Prime
//   const materiiPrime = [
//     { nume: 'Hamei', cantitate: 850, unitate: 'kg', status: 'În stoc' },
//     { nume: 'Malt', cantitate: 1200, unitate: 'kg', status: 'În stoc' },
//     { nume: 'Drojdie', cantitate: 120, unitate: 'kg', status: 'Stoc scăzut' },
//     { nume: 'Apă filtrată', cantitate: 5000, unitate: 'L', status: 'În stoc' }
//   ];
  
//   // Date pentru Camera 2: Producție
//   const productie = [
//     { reteta: 'Pilsner', cantitate: 2500, unitate: 'L', status: 'În producție' },
//     { reteta: 'IPA', cantitate: 1800, unitate: 'L', status: 'În așteptare' },
//     { reteta: 'Weissbier', cantitate: 1200, unitate: 'L', status: 'Finalizat' }
//   ];
  
//   // Date pentru Camera 3: Ambalare
//   const ambalare = [
//     { produs: 'Pilsner Sticle 0.5L', cantitate: 1200, unitate: 'buc', status: 'În proces' },
//     { produs: 'IPA Sticle 0.33L', cantitate: 800, unitate: 'buc', status: 'În așteptare' },
//     { produs: 'Weissbier Keg 30L', cantitate: 15, unitate: 'buc', status: 'Finalizat' }
//   ];
  
//   // Date pentru Camera 4: Depozitare
//   const depozitare = [
//     { produs: 'Pilsner Sticle 0.5L', cantitate: 3600, unitate: 'buc', valoare: 18000 },
//     { produs: 'IPA Sticle 0.33L', cantitate: 4800, unitate: 'buc', valoare: 19200 },
//     { produs: 'Weissbier Keg 30L', cantitate: 45, unitate: 'buc', valoare: 13500 }
//   ];
  
//   // Date pentru Camera 5: Rebuturi
//   const rebuturi = [
//     { produs: 'Pilsner Sticle 0.5L', cantitate: 24, unitate: 'buc', motiv: 'Etichetare defectă' },
//     { produs: 'IPA Sticle 0.33L', cantitate: 12, unitate: 'buc', motiv: 'Umplere incorectă' },
//     { produs: 'Weissbier', cantitate: 50, unitate: 'L', motiv: 'Fermentare eșuată' }
//   ];

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div className="w-64 bg-blue-900 text-white">
//         {/* Logo */}
//         <div className="flex items-center px-4 py-6 bg-blue-800">
//           <Factory className="h-8 w-8 mr-2" />
//           <span className="text-xl font-bold">Curentu</span>
//         </div>
        
//         {/* Navigation */}
//         <nav className="mt-6">
//           <div className="px-4 py-3 bg-blue-800 flex items-center text-blue-200 rounded-lg mx-3">
//             <Home className="h-5 w-5 mr-3" />
//             <span>Dashboard</span>
//           </div>
          
//           <div className="px-4 py-3 flex items-center text-blue-200 hover:bg-blue-800 hover:rounded-lg mx-3 mt-2">
//             <Package className="h-5 w-5 mr-3" />
//             <span>Materii Prime</span>
//           </div>
          
//           <div className="px-4 py-3 flex items-center text-blue-200 hover:bg-blue-800 hover:rounded-lg mx-3 mt-2">
//             <Factory className="h-5 w-5 mr-3" />
//             <span>Producție</span>
//           </div>
          
//           <div className="px-4 py-3 flex items-center text-blue-200 hover:bg-blue-800 hover:rounded-lg mx-3 mt-2">
//             <ShoppingBag className="h-5 w-5 mr-3" />
//             <span>Ambalare</span>
//           </div>
          
//           <div className="px-4 py-3 flex items-center text-blue-200 hover:bg-blue-800 hover:rounded-lg mx-3 mt-2">
//             <Archive className="h-5 w-5 mr-3" />
//             <span>Depozitare</span>
//           </div>
          
//           <div className="px-4 py-3 flex items-center text-blue-200 hover:bg-blue-800 hover:rounded-lg mx-3 mt-2">
//             <AlertTriangle className="h-5 w-5 mr-3" />
//             <span>Rebuturi</span>
//           </div>
          
//           <div className="px-4 py-3 flex items-center text-blue-200 hover:bg-blue-800 hover:rounded-lg mx-3 mt-2">
//             <Settings className="h-5 w-5 mr-3" />
//             <span>Setări</span>
//           </div>
//         </nav>
//       </div>
      
//       {/* Main Content */}
//       <div className="flex-1 overflow-auto">
//         {/* Header */}
//         <header className="bg-white shadow">
//           <div className="flex justify-between items-center px-6 py-4">
//             <h1 className="text-2xl font-semibold text-gray-800">Dashboard General</h1>
//             <div className="flex items-center">
//               <div className="relative mr-4">
//                 <Bell className="h-6 w-6 text-gray-500" />
//                 {notifications > 0 && (
//                   <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                     {notifications}
//                   </span>
//                 )}
//               </div>
//               <div className="flex items-center">
//                 <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
//                   CM
//                 </div>
//                 <span className="ml-2 text-gray-700">Cristian Mihai</span>
//               </div>
//             </div>
//           </div>
//         </header>
        
//         {/* Dashboard Content */}
//         <main className="p-6">
//           {/* Rezumat Camere */}
//           <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
//             <div className="bg-white rounded-lg shadow p-4">
//               <div className="flex items-center mb-3">
//                 <Package className="h-6 w-6 text-blue-600 mr-2" />
//                 <h2 className="text-lg font-semibold text-gray-800">Materii Prime</h2>
//               </div>
//               <p className="text-2xl font-bold">4 tipuri</p>
//               <p className="text-sm text-green-500">Stoc suficient: 3/4</p>
//             </div>
            
//             <div className="bg-white rounded-lg shadow p-4">
//               <div className="flex items-center mb-3">
//                 <Factory className="h-6 w-6 text-purple-600 mr-2" />
//                 <h2 className="text-lg font-semibold text-gray-800">Producție</h2>
//               </div>
//               <p className="text-2xl font-bold">5,500 L</p>
//               <p className="text-sm text-blue-500">În lucru: 2 rețete</p>
//             </div>
            
//             <div className="bg-white rounded-lg shadow p-4">
//               <div className="flex items-center mb-3">
//                 <ShoppingBag className="h-6 w-6 text-amber-600 mr-2" />
//                 <h2 className="text-lg font-semibold text-gray-800">Ambalare</h2>
//               </div>
//               <p className="text-2xl font-bold">2,015 buc</p>
//               <p className="text-sm text-blue-500">În proces: 1 produs</p>
//             </div>
            
//             <div className="bg-white rounded-lg shadow p-4">
//               <div className="flex items-center mb-3">
//                 <Archive className="h-6 w-6 text-green-600 mr-2" />
//                 <h2 className="text-lg font-semibold text-gray-800">Depozitare</h2>
//               </div>
//               <p className="text-2xl font-bold">50,700 LEI</p>
//               <p className="text-sm text-gray-500">Total stoc</p>
//             </div>
            
//             <div className="bg-white rounded-lg shadow p-4">
//               <div className="flex items-center mb-3">
//                 <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
//                 <h2 className="text-lg font-semibold text-gray-800">Rebuturi</h2>
//               </div>
//               <p className="text-2xl font-bold">86 buc</p>
//               <p className="text-sm text-red-500">3 incidente</p>
//             </div>
//           </div>
          
//           {/* Camera 1: Materii Prime */}
//           <div className="bg-white rounded-lg shadow mb-6">
//             <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">
//               <div className="flex items-center">
//                 <Package className="h-5 w-5 text-blue-600 mr-2" />
//                 <h2 className="text-lg font-semibold text-gray-800">Camera 1: Materii Prime</h2>
//               </div>
//               <button className="text-blue-600 hover:text-blue-800">Vezi toate</button>
//             </div>
//             <div className="p-3">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead>
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantitate</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {materiiPrime.map((item, index) => (
//                     <tr key={index}>
//                       <td className="px-4 py-2">
//                         <div className="font-medium text-gray-900">{item.nume}</div>
//                       </td>
//                       <td className="px-4 py-2">
//                         <div className="text-gray-900">{item.cantitate} {item.unitate}</div>
//                       </td>
//                       <td className="px-4 py-2">
//                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
//                           ${item.status === 'În stoc' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                           {item.status}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
          
//           {/* Camera 2: Producție */}
//           <div className="bg-white rounded-lg shadow mb-6">
//             <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">
//               <div className="flex items-center">
//                 <Factory className="h-5 w-5 text-purple-600 mr-2" />
//                 <h2 className="text-lg font-semibold text-gray-800">Camera 2: Producție</h2>
//               </div>
//               <button className="text-blue-600 hover:text-blue-800">Vezi toate</button>
//             </div>
//             <div className="p-3">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead>
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rețetă</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantitate</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {productie.map((item, index) => (
//                     <tr key={index}>
//                       <td className="px-4 py-2">
//                         <div className="font-medium text-gray-900">{item.reteta}</div>
//                       </td>
//                       <td className="px-4 py-2">
//                         <div className="text-gray-900">{item.cantitate} {item.unitate}</div>
//                       </td>
//                       <td className="px-4 py-2">
//                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
//                           ${item.status === 'În producție' ? 'bg-blue-100 text-blue-800' : 
//                             item.status === 'Finalizat' ? 'bg-green-100 text-green-800' : 
//                             'bg-yellow-100 text-yellow-800'}`}>
//                           {item.status}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
          
//           {/* Camera 3: Ambalare */}
//           <div className="bg-white rounded-lg shadow mb-6">
//             <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">
//               <div className="flex items-center">
//                 <ShoppingBag className="h-5 w-5 text-amber-600 mr-2" />
//                 <h2 className="text-lg font-semibold text-gray-800">Camera 3: Ambalare</h2>
//               </div>
//               <button className="text-blue-600 hover:text-blue-800">Vezi toate</button>
//             </div>
//             <div className="p-3">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead>
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produs</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantitate</th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {ambalare.map((item, index) => (
//                     <tr key={index}>
//                       <td className="px-4 py-2">
//                         <div className="font-medium text-gray-900">{item.produs}</div>
//                       </td>
//                       <td className="px-4 py-2">
//                         <div className="text-gray-900">{item.cantitate} {item.unitate}</div>
//                       </td>
//                       <td className="px-4 py-2">
//                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
//                           ${item.status === 'În proces' ? 'bg-blue-100 text-blue-800' : 
//                             item.status === 'Finalizat' ? 'bg-green-100 text-green-800' : 
//                             'bg-yellow-100 text-yellow-800'}`}>
//                           {item.status}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Camera 4: Depozitare */}
//             <div className="bg-white rounded-lg shadow">
//               <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">
//                 <div className="flex items-center">
//                   <Archive className="h-5 w-5 text-green-600 mr-2" />
//                   <h2 className="text-lg font-semibold text-gray-800">Camera 4: Depozitare</h2>
//                 </div>
//                 <button className="text-blue-600 hover:text-blue-800">Vezi toate</button>
//               </div>
//               <div className="p-3">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead>
//                     <tr>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produs</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantitate</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valoare (LEI)</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {depozitare.map((item, index) => (
//                       <tr key={index}>
//                         <td className="px-4 py-2">
//                           <div className="font-medium text-gray-900">{item.produs}</div>
//                         </td>
//                         <td className="px-4 py-2">
//                           <div className="text-gray-900">{item.cantitate} {item.unitate}</div>
//                         </td>
//                         <td className="px-4 py-2">
//                           <div className="text-gray-900">{item.valoare}</div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
            
//             {/* Camera 5: Rebuturi */}
//             <div className="bg-white rounded-lg shadow">
//               <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200">
//                 <div className="flex items-center">
//                   <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
//                   <h2 className="text-lg font-semibold text-gray-800">Camera 5: Rebuturi</h2>
//                 </div>
//                 <button className="text-blue-600 hover:text-blue-800">Vezi toate</button>
//               </div>
//               <div className="p-3">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead>
//                     <tr>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produs</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantitate</th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motiv</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {rebuturi.map((item, index) => (
//                       <tr key={index}>
//                         <td className="px-4 py-2">
//                           <div className="font-medium text-gray-900">{item.produs}</div>
//                         </td>
//                         <td className="px-4 py-2">
//                           <div className="text-gray-900">{item.cantitate} {item.unitate}</div>
//                         </td>
//                         <td className="px-4 py-2">
//                           <div className="text-red-600 text-sm">{item.motiv}</div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }