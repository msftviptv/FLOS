import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } 
  from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// 🔥 إعداد Firebase (حط بيانات مشروعك هنا)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "XXXXXXXXX",
  appId: "XXXXXXXXX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const ordersRef = collection(db, "orders");

// ➕ إضافة طلب
window.addOrder = async function() {
  const order = document.getElementById("order").value.trim();
  const price = document.getElementById("price").value.trim();

  if (!order || !price) return alert("❗ أدخل البيانات كاملة");

  await addDoc(ordersRef, { order, price });
  document.getElementById("order").value = "";
  document.getElementById("price").value = "";
  loadOrders();
};

// 📋 تحميل الطلبات
async function loadOrders() {
  const snapshot = await getDocs(ordersRef);
  const table = document.getElementById("ordersTable");
  table.innerHTML = "";

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input class="edit-input" type="text" value="${data.order}" id="order-${docSnap.id}"></td>
      <td><input class="edit-input" type="number" value="${data.price}" id="price-${docSnap.id}"></td>
      <td>
        <button class="save" onclick="saveOrder('${docSnap.id}')">💾 حفظ</button>
        <button class="delete" onclick="deleteOrder('${docSnap.id}')">🗑 حذف</button>
      </td>
    `;
    table.appendChild(row);
  });
}

// 💾 تعديل الطلب
window.saveOrder = async function(id) {
  const newOrder = document.getElementById(`order-${id}`).value;
  const newPrice = document.getElementById(`price-${id}`).value;
  await updateDoc(doc(db, "orders", id), { order: newOrder, price: newPrice });
  alert("✅ تم تحديث الطلب بنجاح!");
  loadOrders();
};

// ❌ حذف الطلب
window.deleteOrder = async function(id) {
  if (confirm("⚠️ هل أنت متأكد أنك تريد حذف هذا الطلب؟")) {
    await deleteDoc(doc(db, "orders", id));
    loadOrders();
  }
};

// 🚀 تحميل الطلبات عند التشغيل
loadOrders();

