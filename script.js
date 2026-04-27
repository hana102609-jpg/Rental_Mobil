class Mobil {
  constructor(nama, tipe, harga, tersedia) {
    this.nama = nama;
    this.tipe = tipe;
    this.harga = harga;
    this.tersedia = tersedia;
  }
}

class Booking {
  constructor(nama, mobil, mulai, kembali) {
    this.nama = nama;
    this.mobil = mobil;
    this.mulai = new Date(mulai);
    this.kembali = new Date(kembali);
    this.hari = Math.ceil((this.kembali - this.mulai) / (1000 * 60 * 60 * 24));
    this.total = this.hari * mobil.harga;
  }

  selesai() {
    return new Date() > this.kembali;
  }
}

class App {
  constructor() {
    this.mobil = [];
    this.rental = [];
    this.selected = null;

    this.loadMobil();
    this.loadData();
    this.render();
  }

  loadMobil() {
    document.querySelectorAll(".card").forEach(card => {
      this.mobil.push(new Mobil(
        card.dataset.nama,
        card.dataset.tipe,
        parseInt(card.dataset.harga),
        card.dataset.status === "true"
      ));
    });
  }

  pilihMobil(nama) {
    const m = this.mobil.find(x => x.nama === nama);
    if (!m || !m.tersedia) return alert("Tidak tersedia");

    this.selected = m;
    alert("Dipilih: " + nama);
  }

  tambahRental(b) {
    this.rental.push(b);
    b.mobil.tersedia = false;
    this.saveData();
    this.render();
  }

  hapus(i) {
    this.rental[i].mobil.tersedia = true;
    this.rental.splice(i, 1);
    this.saveData();
    this.render();
  }

  render() {
    const el = document.getElementById("listRental");
    el.innerHTML = "";

    this.rental.forEach((b, i) => {
      el.innerHTML += `
        <div class="Rental-card">
          <h3>${b.nama}</h3>
          <p>${b.mobil.nama}</p>
          <p>${b.hari} hari</p>
          <p>Total: Rp ${b.total.toLocaleString()}</p>
          <button class="btn-hapus" onclick="app.hapus(${i})">Hapus</button>
        </div>
      `;
    });

    this.updateUI();
  }

  updateUI() {
    document.querySelectorAll(".card").forEach(card => {
      const m = this.mobil.find(x => x.nama === card.dataset.nama);
      const btn = card.querySelector("button");

      if (!m) return;

      btn.disabled = !m.tersedia;
      btn.innerText = m.tersedia ? "Pilih" : "Tidak Tersedia";
    });
  }

  filter(k, t) {
    document.querySelectorAll(".card").forEach(card => {
      const show =
        card.dataset.nama.toLowerCase().includes(k) &&
        (t === "all" || card.dataset.tipe === t);

      card.style.display = show ? "block" : "none";
    });
  }

  saveData() {
    localStorage.setItem("rental", JSON.stringify(this.rental));
  }

  loadData() {
    const data = JSON.parse(localStorage.getItem("rental")) || [];

    data.forEach(d => {
      const m = this.mobil.find(x => x.nama === d.mobil.nama);
      if (m) {
        this.rental.push(new Booking(d.nama, m, d.mulai, d.kembali));
        m.tersedia = false;
      }
    });
  }
}

const app = new App();

/* FORM */
function buatRental() {
  const nama = document.getElementById("nama").value;
  const mulai = document.getElementById("mulai").value;
  const kembali = document.getElementById("kembali").value;

  if (!nama || !mulai || !kembali) return alert("Isi semua data");
  if (!app.selected) return alert("Pilih mobil");

  app.tambahRental(new Booking(nama, app.selected, mulai, kembali));
}

/* FILTER */
document.getElementById("cari").addEventListener("input", update);
document.getElementById("filter").addEventListener("change", update);

function update() {
  app.filter(
    document.getElementById("cari").value.toLowerCase(),
    document.getElementById("filter").value
  );
}

/* MODAL */
function stars(r) {
  return "⭐".repeat(Math.floor(r)) + " (" + r + ")";
}

document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("click", e => {
    if (e.target.tagName === "BUTTON") return;

    const modal = document.getElementById("modal");
    modal.classList.add("show");

    document.getElementById("modalNama").innerText = card.dataset.nama;
    document.getElementById("modalTipe").innerText = card.dataset.tipe;
    document.getElementById("modalHarga").innerText =
      "Rp " + parseInt(card.dataset.harga).toLocaleString();
    document.getElementById("modalDeskripsi").innerText = card.dataset.deskripsi;
    document.getElementById("modalSpesifikasi").innerText =
      "Spesifikasi: " + card.dataset.spesifikasi;
    document.getElementById("modalRating").innerText =
      stars(card.dataset.rating);
  });
});

document.getElementById("close").onclick = () =>
  document.getElementById("modal").classList.remove("show");

window.onclick = e => {
  if (e.target.id === "modal") {
    document.getElementById("modal").classList.remove("show");
  }
};