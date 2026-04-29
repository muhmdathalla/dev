#include <iostream> // Untuk input dan output standar
#include <string>   // Untuk tipe data string
#include <limits>   // Untuk batasan input agar lebih aman
#include <fstream>  // Untuk file input/output
using namespace std;

// Struktur untuk menyimpan data buku
struct Buku {
    string judul;
    string penulis;
    string penerbit;
    int tahun_terbit;
};

// Fungsi untuk memperbesar kapasitas array jika penuh
void perluasArray(Buku* &perpustakaan, int &kapasitas) {
    int kapasitasBaru = kapasitas * 2;             // Gandakan kapasitas array
    Buku* temp = new Buku[kapasitasBaru];          // Buat array baru dengan kapasitas lebih besar
    for (int i = 0; i < kapasitas; i++) {
        temp[i] = perpustakaan[i];                 // Salin data dari array lama ke array baru
    }
    delete[] perpustakaan;                         // Hapus array lama
    perpustakaan = temp;                           // Arahkan pointer ke array baru
    kapasitas = kapasitasBaru;                     // Perbarui nilai kapasitas
}

void simpanFile(Buku* perpustakaan, int jumlah) {
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
    std::string namaFile;
    std::cout << "\nMasukkan nama file untuk menyimpan data buku (contoh: bukuku.txt): ";
    std::getline(std::cin, namaFile);

    std::ofstream file(namaFile);
    if (!file) {
        std::cout << "\nGagal menyimpan ke file " << namaFile << std::endl;
        return;
    }
    for (int i = 0; i < jumlah; i++) {
        file << "Judul     : " << perpustakaan[i].judul << std::endl;
        file << "Penulis   : " << perpustakaan[i].penulis << std::endl;
        file << "Penerbit  : " << perpustakaan[i].penerbit << std::endl;
        file << "Tahun     : " << perpustakaan[i].tahun_terbit << std::endl;
        file << "--------------------------" << std::endl;
    }
    file.close();
    std::cout << "\nData berhasil disimpan ke " << namaFile << std::endl;
}

// Fungsi untuk memuat data dari file ke array buku
void muatDariFile(Buku* &perpustakaan, int &jumlah, int &kapasitas, const string& namaFile) {
    // Kosongkan array yang sudah ada di memori sebelum memuat dari file baru
    if (perpustakaan != nullptr) {
        delete[] perpustakaan;
        perpustakaan = nullptr; // Hindari dangling pointer
    }
    jumlah = 0; // Reset jumlah buku

    ifstream file(namaFile); // Buka file untuk dibaca
    if (!file) {
        // Pesan ini dihilangkan sesuai permintaan
        // cout << "\nFile '" << namaFile << "' tidak ditemukan. Memulai dengan perpustakaan kosong.\n";
        perpustakaan = new Buku[kapasitas]; // Buat ulang array jika file tidak ada
        return; // Jika file tidak ditemukan, keluar
    }

    // Pastikan kapasitas cukup atau perluas
    string line;
    int perkiraanJumlahBuku = 0;
    ifstream hitungFile(namaFile);
    while (getline(hitungFile, line)) {
        if (line.rfind("Judul     : ", 0) == 0) { // Cek apakah baris dimulai dengan "Judul     : "
            perkiraanJumlahBuku++;
        }
    }
    hitungFile.close();

    if (perkiraanJumlahBuku > kapasitas) {
        while (kapasitas < perkiraanJumlahBuku) {
            perluasArray(perpustakaan, kapasitas);
        }
    }
    if (perpustakaan == nullptr) { // Pastikan perpustakaan sudah dialokasikan
        perpustakaan = new Buku[kapasitas];
    }


    file.clear(); // Bersihkan flag EOF jika sebelumnya sudah dibaca sampai akhir
    file.seekg(0, ios::beg); // Kembali ke awal file

    while (getline(file, line)) {
        if (line.rfind("Judul     : ", 0) == 0) { // Jika ini adalah baris judul buku
            if (jumlah == kapasitas) {
                perluasArray(perpustakaan, kapasitas); // Perluas jika penuh
            }
            perpustakaan[jumlah].judul = line.substr(line.find(":") + 2);

            getline(file, line); // Baca baris penulis
            perpustakaan[jumlah].penulis = line.substr(line.find(":") + 2);

            getline(file, line); // Baca baris penerbit
            perpustakaan[jumlah].penerbit = line.substr(line.find(":") + 2);

            getline(file, line); // Baca baris tahun
            perpustakaan[jumlah].tahun_terbit = stoi(line.substr(line.find(":") + 2));

            getline(file, line); // Baca baris "--------------------------"

            jumlah++;
        }
    }
    file.close(); // Tutup file
    // Pesan ini dihilangkan sesuai permintaan
    // cout << "\nData berhasil dimuat dari '" << namaFile << "'. Jumlah buku: " << jumlah << endl;
}

// Fungsi Bubble Sort Ascending
void bubbleSort(Buku* perpustakaan, int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (perpustakaan[j].judul > perpustakaan[j + 1].judul) {
                swap(perpustakaan[j], perpustakaan[j + 1]); // Tukar jika perlu
            }
        }
    }
}

// Fungsi Bubble Sort Descending
void bubbleSort2(Buku* perpustakaan, int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (perpustakaan[j].judul < perpustakaan[j + 1].judul) {
                swap(perpustakaan[j], perpustakaan[j + 1]); // Tukar jika perlu
            }
        }
    }
}

// Fungsi Selection Sort Ascending
void selectionsort(Buku* perpustakaan, int n) {
    for (int i = 0; i < n -1; i++) {
        int minIndex = i;
        for (int j = i + 1; j < n; j++) {
            if (perpustakaan[j].judul < perpustakaan[minIndex].judul) {
                minIndex = j;
            }
        }
        swap(perpustakaan[i], perpustakaan[minIndex]); // Tukar dengan elemen terkecil
    }
}    

// Fungsi Selection Sort Descending
void selectionsort2(Buku* perpustakaan, int n) {
    for (int i = 0; i < n -1; i++) {
        int minIndex = i;
        for (int j = i + 1; j < n; j++) {
            if (perpustakaan[j].judul > perpustakaan[minIndex].judul) {
                minIndex = j;
            }
        }
        swap(perpustakaan[i], perpustakaan[minIndex]); // Tukar dengan elemen terkecil
    }
}    

// Fungsi Insertion Sort Ascending
void insertionsort(Buku* perpustakaan, int n) {
    for (int i = 1; i < n; i++) {
        Buku key = perpustakaan[i];
        int j = i - 1;
        while (j >= 0 && perpustakaan[j].judul > key.judul) {
            perpustakaan[j + 1] = perpustakaan[j];
            j--;  
        }
        perpustakaan[j + 1] = key;
    } 
}

// Fungsi Insertion Sort Descending
void insertionsort2(Buku* perpustakaan, int n) {
    for (int i = 1; i < n; i++) {
        Buku key = perpustakaan[i];
        int j = i - 1;
        while (j >= 0 && perpustakaan[j].judul < key.judul) {
            perpustakaan[j + 1] = perpustakaan[j];
            j--;  
        }
        perpustakaan[j + 1] = key;
    } 
}

// Fungsi Shell Sort Ascending
void shellsort(Buku* perpustakaan, int n) { 
    for (int gap = n / 2; gap > 0; gap /= 2) {  
        for (int i = gap; i < n; i++) {  
            Buku temp = perpustakaan[i];  
            int j;  
            for (j = i; j >= gap && perpustakaan[j - gap].judul > temp.judul; j -= gap) {  
                perpustakaan[j] = perpustakaan[j - gap];
            }
            perpustakaan[j] = temp;  
        }  
    }
} 

// Fungsi Shell Sort Descending
void shellsort2(Buku* perpustakaan, int n) { 
    for (int gap = n / 2; gap > 0; gap /= 2) {  
        for (int i = gap; i < n; i++) {  
            Buku temp = perpustakaan[i];  
            int j;  
            for (j = i; j >= gap && perpustakaan[j - gap].judul < temp.judul; j -= gap) {  
                perpustakaan[j] = perpustakaan[j - gap];
            }
            perpustakaan[j] = temp;  
        }  
    }
} 


// Quick Sort Ascending
int partition(Buku* perpustakaan, int awal, int akhir) {
    string pivot = perpustakaan[akhir].judul;
    int ip = awal;
    for (int i = awal; i < akhir; i++) {
        if (perpustakaan[i].judul <= pivot) {
            swap(perpustakaan[i], perpustakaan[ip]);
            ip++;
        }
    }
    swap(perpustakaan[akhir], perpustakaan[ip]);
    return ip;
}

void quicksort(Buku* perpustakaan, int awal, int akhir) {
    if (awal < akhir) {
        int ip = partition(perpustakaan, awal, akhir);
        quicksort(perpustakaan, awal, ip - 1);
        quicksort(perpustakaan, ip + 1, akhir);
    }
}

// Quick Sort Descending
int partition2(Buku* perpustakaan, int awal, int akhir) {
    string pivot = perpustakaan[akhir].judul;
    int ip = awal;
    for (int i = awal; i < akhir; i++) {
        if (perpustakaan[i].judul >= pivot) {
            swap(perpustakaan[i], perpustakaan[ip]);
            ip++;
        }
    }
    swap(perpustakaan[akhir], perpustakaan[ip]);
    return ip;
}

void quicksort2(Buku* perpustakaan, int awal, int akhir) {
    if (awal < akhir) {
        int ip = partition2(perpustakaan, awal, akhir);
        quicksort(perpustakaan, awal, ip - 1);
        quicksort(perpustakaan, ip + 1, akhir);
    }
}

// Merge Sort Ascending
void Merge(Buku* perpustakaan, int awalkiri, int akhirkiri, int awalkanan, int akhirkanan) {
    int ukuran = akhirkanan - awalkiri + 1;
    Buku* temp = new Buku[ukuran];
    int kiri = awalkiri, kanan = awalkanan, i = 0;

    while (kiri <= akhirkiri && kanan <= akhirkanan) {
        if (perpustakaan[kiri].judul <= perpustakaan[kanan].judul) {
            temp[i++] = perpustakaan[kiri++];
        } else {
            temp[i++] = perpustakaan[kanan++];
        }
    }
    while (kiri <= akhirkiri) temp[i++] = perpustakaan[kiri++];
    while (kanan <= akhirkanan) temp[i++] = perpustakaan[kanan++];
    for (i = 0; i < ukuran; i++) {
        perpustakaan[awalkiri + i] = temp[i];
    }
    delete[] temp;
}

void MergeSort(Buku* perpustakaan, int awal, int akhir) {
    if (awal < akhir) {
        int tengah = (awal + akhir) / 2;
        MergeSort(perpustakaan, awal, tengah);
        MergeSort(perpustakaan, tengah + 1, akhir);
        Merge(perpustakaan, awal, tengah, tengah + 1, akhir);
    }
}

// Merge Sort Descending
void Merge2(Buku* perpustakaan, int awalkiri, int akhirkiri, int awalkanan, int akhirkanan) {
    int ukuran = akhirkanan - awalkiri + 1;
    Buku* temp = new Buku[ukuran];
    int kiri = awalkiri, kanan = awalkanan, i = 0;

    while (kiri <= akhirkiri && kanan <= akhirkanan) {
        if (perpustakaan[kiri].judul >= perpustakaan[kanan].judul) {
            temp[i++] = perpustakaan[kiri++];
        } else {
            temp[i++] = perpustakaan[kanan++];
        }
    }
    while (kiri <= akhirkiri) temp[i++] = perpustakaan[kiri++];
    while (kanan <= akhirkanan) temp[i++] = perpustakaan[kanan++];
    for (i = 0; i < ukuran; i++) {
        perpustakaan[awalkiri + i] = temp[i];
    }
    delete[] temp;
}

void MergeSort2(Buku* perpustakaan, int awal, int akhir) {
    if (awal < akhir) {
        int tengah = (awal + akhir) / 2;
        MergeSort2(perpustakaan, awal, tengah);               // pakai MergeSort2
        MergeSort2(perpustakaan, tengah + 1, akhir);          // pakai MergeSort2
        Merge2(perpustakaan, awal, tengah, tengah + 1, akhir); // pakai Merge2
    }
}


// Pencarian Sequential
int SequentialSearch(Buku* perpustakaan, int n, const string &judulCari) {
    for (int i = 0; i < n; i++) {
        if (perpustakaan[i].judul == judulCari) {
            return i;
        }
    }
    return -1; // Tidak ditemukan
}

// Pencarian Binary (array harus terurut)
int binarySearch(Buku* perpustakaan, int n, const string &judulCari) {
    int kiri = 0, kanan = n - 1;
    while (kiri <= kanan) {
        int tengah = kiri + (kanan - kiri) / 2;
        if (perpustakaan[tengah].judul == judulCari) {
            return tengah;
        }
        if (perpustakaan[tengah].judul < judulCari) {
            kiri = tengah + 1;
        } else {
            kanan = tengah - 1;
        }
    }
    return -1; // Tidak ditemukan
    // Note: Pastikan array 'perpustakaan' sudah terurut sebelum memanggil binarySearch
}

// Fungsi untuk menambah buku baru
void tambahBuku(Buku* &perpustakaan, int &jumlah, int &kapasitas, int jumlahBukuTambahan) {
    for (int k = 0; k < jumlahBukuTambahan; k++) {
        if (jumlah == kapasitas) perluasArray(perpustakaan, kapasitas);
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
        cout << "\n--- Masukkan data buku ke-" << k + 1 << " ---\n";
        cout << "Masukkan judul buku     : ";
        getline(cin, perpustakaan[jumlah].judul);
        cout << "Masukkan nama penulis   : ";
        getline(cin, perpustakaan[jumlah].penulis);
        cout << "Masukkan nama penerbit  : ";
        getline(cin, perpustakaan[jumlah].penerbit);
        while (true) {
            cout << "Masukkan tahun terbit   : ";
            cin >> perpustakaan[jumlah].tahun_terbit;
            if (cin.fail()) {
                cin.clear();
                cin.ignore(numeric_limits<streamsize>::max(), '\n');
                cout << "Input tidak valid! Masukkan angka tahun yang benar.\n";
            } else {
                break;
            }
        }
        jumlah++;
    }
    bubbleSort(perpustakaan, jumlah); // Urutkan setelah semua buku ditambahkan (jika perlu untuk binary search)
    cout << "\n Buku berhasil ditambahkan dan diurutkan (secara internal di memori).\n";
}

// Menampilkan semua buku dari memori
void tampilkanBuku(Buku* perpustakaan, int jumlah) {
    if (jumlah == 0) {
        cout << "\n Perpustakaan masih kosong!\n";
        return;
    }
    cout << "\n===  Daftar Buku di Perpustakaan (Memori) ===\n";
    for (int i = 0; i < jumlah; i++) {
        cout << "\n Buku " << i + 1 << ":\n";
        cout << "   Judul     : " << perpustakaan[i].judul << endl;
        cout << "   Penulis   : " << perpustakaan[i].penulis << endl;
        cout << "   Penerbit  : " << perpustakaan[i].penerbit << endl;
        cout << "   Tahun     : " << perpustakaan[i].tahun_terbit << endl;
        cout << "---------------------------";
    }
    cout << endl;
}

// Menampilkan buku dari file custom
void tampilkanDariFile(const string& namaFile) { // Tambah parameter namaFile
    ifstream file(namaFile); // Buka file sesuai namaFile
    if (!file) {
        cout << "❌ File '" << namaFile << "' tidak ditemukan atau belum ada data.\n";
        return;
    }

    string judul, penulis, penerbit;
    int tahun;
    int nomor = 1;

    cout << "\n=== Buku yang Tersimpan di File '" << namaFile << "' ===\n";
    string line;
    while (getline(file, line)) { // Baca baris per baris
        if (line.rfind("Judul     : ", 0) == 0) { // Cek apakah baris dimulai dengan "Judul     : "
            judul = line.substr(line.find(":") + 2); // Ambil setelah ": "

            getline(file, penulis);
            penulis = penulis.substr(penulis.find(":") + 2);

            getline(file, penerbit);
            penerbit = penerbit.substr(penerbit.find(":") + 2);

            getline(file, line); // Baca baris tahun
            tahun = stoi(line.substr(line.find(":") + 2)); // Konversi string ke int

            getline(file, line); // Baca baris "--------------------------" (pemisah)

            cout << "\n📘 Buku " << nomor++ << ":\n";
            cout << "   Judul     : " << judul << endl;
            cout << "   Penulis   : " << penulis << endl;
            cout << "   Penerbit  : " << penerbit << endl;
            cout << "   Tahun     : " << tahun << endl;
            cout << "---------------------------";
        }
    }
    file.close();
    cout << endl;
}


// Fungsi utama program
int main() {
    int kapasitas = 10; // Kapasitas awal
    int jumlah = 0; // Jumlah buku saat ini
    Buku* perpustakaan = nullptr; // Inisialisasi dengan nullptr
    
    // Default nama file yang akan digunakan jika user tidak menentukan
    string defaultNamaFile = "data_perpustakaan_default.txt"; 
    string namaFileAktif = defaultNamaFile; // Variabel untuk menyimpan nama file yang sedang aktif digunakan

    // Muat data saat program dimulai dari nama file default
    // Pesan ini tidak akan ditampilkan karena sudah dihapus dari muatDariFile
    muatDariFile(perpustakaan, jumlah, kapasitas, namaFileAktif);

    int pilihan, subpil, submenu;
    string judulCari;

    do {
        // Tampilkan menu utama
        cout << "\n===  Menu Perpustakaan ===\n";
        cout << "1 Tambah Buku\n";
        cout << "2 Tampilkan Semua Buku dari File\n"; 
        cout << "3 Cari Buku \n"; 
        cout << "4 Sorting Buku \n"; 
        cout << "5 Keluar Program \n"; 
        cout << "Pilih menu: ";
        cin >> pilihan;

        switch (pilihan) {
            case 1: {
                int jumlahBukuTambahan;
                cout << "Berapa buku yang ingin Anda tambahkan: ";
                cin >> jumlahBukuTambahan;

                if (cin.fail() || jumlahBukuTambahan <= 0) {
                    cin.clear();
                    cin.ignore(numeric_limits<streamsize>::max(), '\n');
                    cout << "\nInput tidak valid! Masukkan angka positif untuk jumlah buku.\n";
                    continue;
                }
                
                tambahBuku(perpustakaan, jumlah, kapasitas, jumlahBukuTambahan);
                // Setelah menambah buku, simpan ke file
                simpanFile(perpustakaan, jumlah); // Simpan ke file setelah penambahan
                break;
            }
            case 2: {
                cin.ignore(numeric_limits<streamsize>::max(), '\n'); // Bersihkan buffer input
                cout << "\nMasukkan nama file buku yang ingin ditampilkan (contoh: bukuku.txt): ";
                getline(cin, namaFileAktif); // Ambil nama file dari user dan jadikan nama file aktif
                
                // Muat ulang data dari file yang diminta ke dalam memori
                // Ini akan mengganti isi 'perpustakaan' di memori dengan isi file
                muatDariFile(perpustakaan, jumlah, kapasitas, namaFileAktif);
                
                // Tampilkan data yang baru dimuat ke memori
                tampilkanBuku(perpustakaan, jumlah); 
                break;
            }
            case 3:
                // Pastikan perpustakaan tidak kosong
                if (jumlah == 0) {
                    cout << "\nPerpustakaan kosong. Silakan tambahkan buku terlebih dahulu atau muat dari file (Menu 2).\n";
                    break;
                }
                cin.ignore(numeric_limits<streamsize>::max(), '\n');
                cout << "\nMasukkan judul buku yang ingin dicari: ";
                getline(cin, judulCari);
                cout << "\nPilih metode pencarian: \n";
                cout << "1. Sequential Search\n";
                cout << "2. Binary Search\n";
                cout << "Pilihan: ";
                int metode;
                cin >> metode;
                if (cin.fail()) {
                    cin.clear();
                    cin.ignore(numeric_limits<streamsize>::max(), '\n');
                    cout << "\n Pilihan tidak valid!\n";
                    continue;
                }
                int index;
                if (metode == 1) {
                    index = SequentialSearch(perpustakaan, jumlah, judulCari);
                } else if (metode == 2) {
                    index = binarySearch(perpustakaan, jumlah, judulCari);
                } else {
                    cout << "\n Metode pencarian tidak valid!\n";
                    continue;
                }
                if (index != -1) {
                    cout << "\n Buku ditemukan pada daftar ke-" << index + 1 << " (di memori):\n";
                    cout << "   Judul     : " << perpustakaan[index].judul << endl;
                    cout << "   Penulis   : " << perpustakaan[index].penulis << endl;
                    cout << "   Penerbit  : " << perpustakaan[index].penerbit << endl;
                    cout << "   Tahun     : " << perpustakaan[index].tahun_terbit << endl;
                } else {
                    cout << "\n Buku tidak ditemukan.\n";
                }
                break;
            case 4:
                if (jumlah == 0) {
                    cout << "\n Tidak ada buku di memori yang bisa diurutkan!\n";
                    break;
                }
                cout << "\nPilih metode Sorting: " << endl;
                cout << "1. Bubble Sorting " << endl;
                cout << "2. Insertion Sorting " << endl;
                cout << "3. Selection Sorting " << endl;
                cout << "4. Shell Sorting " << endl;
                cout << "5. Merge Sorting " << endl;
                cout << "6. Quick Sorting " << endl;
                cout << "7. Kembali ke Menu Utama"<< endl; 
                cout << "Masukkan pilihan: ";
                cin >> subpil;
                if (cin.fail()) {
                    cin.clear();
                    cin.ignore(numeric_limits<streamsize>::max(), '\n');
                    cout << "\n Pilihan tidak valid! Masukkan angka yang benar.\n";
                    continue;
                }
                switch (subpil) {
                    case 1:
                        cout << "1. Ascending "  << endl;
                        cout << "2. Descending " << endl;
                        cout << "Masukkan pilihan: ";
                        cin >> submenu;
                        switch (submenu) {
                          case 1:
                          bubbleSort(perpustakaan, jumlah);
                          cout << "\n Buku berhasil diurutkan dengan Bubble Sort secara Ascending (di memori).\n";
                          break;

                          case 2:
                          bubbleSort2(perpustakaan, jumlah);
                          cout << "\n Buku berhasil diurutkan dengan Bubble Sort secara Descending (di memori).\n";
                          break;

                          default:
                          cout << "Pilihan tidak tersedia.\n";
                          break;
                        }
                        break;
                    case 2:
                        cout << "1. Ascending "  << endl;
                        cout << "2. Descending " << endl;
                        cout << "Masukkan pilihan: ";
                        cin >> submenu;
                        switch (submenu) {
                          case 1:
                          insertionsort(perpustakaan, jumlah);
                          cout << "\n Buku berhasil diurutkan dengan Insertion Sort secara Ascending (di memori).\n";
                          break;

                          case 2:
                          insertionsort2(perpustakaan, jumlah);
                          cout << "\n Buku berhasil diurutkan dengan Insertion Sort secara Descending (di memori).\n";
                          break;

                          default:
                          cout << "Pilihan tidak tersedia.\n";
                          break;
                        }
                        break;
                    case 3:
                        cout << "1. Ascending "  << endl;
                        cout << "2. Descending " << endl;
                        cout << "Masukkan pilihan: ";
                        cin >> submenu;
                        switch (submenu) {
                          case 1:
                          selectionsort(perpustakaan, jumlah);
                          cout << "\n Buku berhasil diurutkan dengan Selection Sort secara Ascending (di memori).\n";
                          break;

                          case 2:
                          selectionsort2(perpustakaan, jumlah);
                          cout << "\n Buku berhasil diurutkan dengan Selection Sort secara Descending (di memori).\n";
                          break;

                          default:
                          cout << "Pilihan tidak tersedia.\n";
                          break;
                        }
                        break;
                    case 4:
                        cout << "1. Ascending "  << endl;
                        cout << "2. Descending " << endl;
                        cout << "Masukkan pilihan: ";
                        cin >> submenu;
                        switch (submenu) {
                          case 1:
                          shellsort(perpustakaan, jumlah);
                          cout << "\n Buku berhasil diurutkan dengan Shell Sort secara Ascending (di memori).\n";
                          break;

                          case 2:
                          shellsort2(perpustakaan, jumlah);
                          cout << "\n Buku berhasil diurutkan dengan Shell Sort secara Descending (di memori).\n";
                          break;

                          default:
                          cout << "Pilihan tidak tersedia.\n";
                          break;
                        }
                        break;
                    case 5:
                        cout << "1. Ascending "  << endl;
                        cout << "2. Descending " << endl;
                        cout << "Masukkan pilihan: ";
                        cin >> submenu;
                        switch (submenu) {
                          case 1:
                          MergeSort(perpustakaan, 0, jumlah - 1);
                         cout << "\n Buku berhasil diurutkan dengan Merge Sort secara Ascending (di memori).\n";
                          break;

                          case 2:
                          MergeSort2(perpustakaan, 0, jumlah - 1);
                          cout << "\n Buku berhasil diurutkan dengan Merge Sort secara Descending (di memori).\n";
                          break;

                          default:
                          cout << "Pilihan tidak tersedia.\n";
                          break;
                        }
                        break;
                    case 6:
                        cout << "1. Ascending "  << endl;
                        cout << "2. Descending " << endl;
                        cout << "Masukkan pilihan: ";
                        cin >> submenu;
                        switch (submenu) {
                          case 1:
                          quicksort(perpustakaan, 0, jumlah - 1);
                          cout << "\n Buku berhasil diurutkan dengan Quick Sort secara Ascending (di memori).\n";
                          break;

                          case 2:
                          quicksort2(perpustakaan, 0, jumlah - 1);
                          cout << "\n Buku berhasil diurutkan dengan Quick Sort secara Descending (di memori).\n";
                          break;

                          default:
                          cout << "Pilihan tidak tersedia.\n";
                          break;
                        }
                        break;
                    case 7: // Opsi untuk kembali ke menu utama
                        break;
                    default:
                        cout << "\n Pilihan tidak valid! Masukkan angka yang benar.\n";
                        break;
                }
                if (subpil >=1 && subpil <=6) { // Jika sorting dilakukan, tampilkan hasilnya
                    cout << "\n Daftar buku setelah diurutkan (di memori):\n";
                    tampilkanBuku(perpustakaan, jumlah); // Tampilkan buku setelah diurutkan di memori
                }
                // Simpan hasil sorting ke file yang sama
                simpanFile(perpustakaan, jumlah); // Simpan data buku ke file setelah sorting
                break;
            case 5: // Opsi keluar program
                // Pastikan data terakhir disimpan ke file yang terakhir digunakan sebelum program berakhir
                if (jumlah > 0) { // Hanya simpan jika ada buku di memori
                    simpanFile(perpustakaan, jumlah); // Simpan data buku ke file  
                } else {
                    cout << "\n Tidak ada buku di memori untuk disimpan.\n";
                }
                cout << "\n Terima kasih telah menggunakan program perpustakaan!\n";
                break;
            default:
                cout << "\n Pilihan tidak valid!\n";
        }
    } while (pilihan != 5); // Ulangi sampai pilih keluar

    delete[] perpustakaan; // Bersihkan memori yang dialokasikan secara dinamis
    return 0;
}