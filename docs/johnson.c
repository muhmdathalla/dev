#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <limits.h>

#define V 7
#define INF 99999

typedef struct
{
    char nama[30];
} Kecamatan;

typedef struct
{
    int dist;
    int visited;
} Node;

void getInitial(Kecamatan kec[], int index, char initial[3]);
void getInitial(Kecamatan kec[], int index, char initial[3])
{
    initial[0] = kec[index].nama[0];
    initial[1] = kec[index].nama[1];
    initial[2] = '\0'; // Null-terminator
}
// Fungsi untuk inisialisasi kecamatan
void initKecamatan(Kecamatan kec[])
{
    strcpy(kec[0].nama, "Danurejan");
    strcpy(kec[1].nama, "Gedong Tengen");
    strcpy(kec[2].nama, "Gondokusuman");
    strcpy(kec[3].nama, "Jetis");
    strcpy(kec[4].nama, "Tegalrejo");
    strcpy(kec[5].nama, "Kotabaru");
    strcpy(kec[6].nama, "Umbulharjo");
}

// Fungsi untuk inisialisasi adjacency matrix
void initGraph(int graph[V][V])
{
    int i, j;
    for (i = 0; i < V; i++)
    {
        for (j = 0; j < V; j++)
        {
            graph[i][j] = INF;
        }
        graph[i][i] = 0;
    }

    // Edge berdasarkan graf yang diberikan
    graph[0][1] = 7;  // Danurejan -> Gedong Tengen
    graph[0][2] = 17; // Danurejan -> Gondokusuman
    graph[0][3] = 11; // Danurejan -> Jetis

    graph[1][0] = 7; // Gedong Tengen -> Danurejan
    graph[1][2] = 3; // Gedong Tengen -> Gondokusuman
    graph[1][3] = 5; // Gedong Tengen -> Jetis
    graph[1][5] = 3; // Gedong Tengen -> Kotabaru

    graph[2][0] = 17; // Gondokusuman -> Danurejan
    graph[2][1] = 3;  // Gondokusuman -> Gedong Tengen
    graph[2][4] = 5;  // Gondokusuman -> Tegalrejo
    graph[2][5] = 5;  // Gondokusuman -> Kotabaru

    graph[3][0] = 11; // Jetis -> Danurejan
    graph[3][1] = 5;  // Jetis -> Gedong Tengen
    graph[3][6] = 9;  // Jetis -> Umbulharjo

    graph[4][2] = 5; // Tegalrejo -> Gondokusuman
    graph[4][5] = 4; // Tegalrejo -> Kotabaru
    graph[4][6] = 3; // Tegalrejo -> Umbulharjo

    graph[5][1] = 3;  // Kotabaru -> Gedong Tengen
    graph[5][2] = 5;  // Kotabaru -> Gondokusuman
    graph[5][4] = 4;  // Kotabaru -> Tegalrejo
    graph[5][3] = 12; // Kotabaru -> Jetis

    graph[6][4] = 3; // Umbulharjo -> Tegalrejo
    graph[6][3] = 9; // Umbulharjo -> Jetis
}

// Bellman-Ford Algorithm untuk reweighting
int bellmanFord(int graph[V][V], int h[])
{
    int dist[V + 1];
    int i, j, k;

    for (i = 0; i <= V; i++)
    {
        dist[i] = INF;
    }
    dist[V] = 0;

    // Relaksasi semua edge V kali
    for (i = 0; i < V; i++)
    {
        for (j = 0; j < V; j++)
        {
            for (k = 0; k < V; k++)
            {
                if (graph[j][k] != INF && dist[j] + graph[j][k] < dist[k])
                {
                    dist[k] = dist[j] + graph[j][k];
                }
            }
        }
        // Edge dari node tambahan ke semua node
        for (j = 0; j < V; j++)
        {
            if (dist[V] + 0 < dist[j])
            {
                dist[j] = 0;
            }
        }
    }

    // Copy hasil ke array h
    for (i = 0; i < V; i++)
    {
        h[i] = dist[i];
    }

    return 1;
}

// Fungsi untuk mencari node dengan jarak minimum (Dijkstra)
int minDistance(int dist[], int visited[])
{
    int min = INF;
    int min_index = -1;
    int i;

    for (i = 0; i < V; i++)
    {
        if (!visited[i] && dist[i] <= min)
        {
            min = dist[i];
            min_index = i;
        }
    }

    return min_index;
}

// Dijkstra Algorithm
void dijkstra(int graph[V][V], int src, int dist[], int parent[])
{
    int visited[V];
    int i, count, u, v;

    for (i = 0; i < V; i++)
    {
        dist[i] = INF;
        visited[i] = 0;
        parent[i] = -1;
    }

    dist[src] = 0;

    for (count = 0; count < V - 1; count++)
    {
        u = minDistance(dist, visited);
        if (u == -1)
            break;

        visited[u] = 1;

        for (v = 0; v < V; v++)
        {
            if (!visited[v] && graph[u][v] != INF &&
                dist[u] + graph[u][v] < dist[v])
            {
                dist[v] = dist[u] + graph[u][v];
                parent[v] = u;
            }
        }
    }
}

// Johnson's Algorithm
void johnsonAlgorithm(int graph[V][V], int allPairsDist[V][V], int allPairsParent[V][V])
{
    int h[V];
    int reweighted[V][V];
    int i, j, u, v;
    int dist[V], parent[V];

    printf("\n========================================\n");
    printf("  JOHNSON'S ALGORITHM - PROSES\n");
    printf("========================================\n");

    // Step 1: Bellman-Ford untuk mendapatkan h values
    printf("\nStep 1: Menjalankan Bellman-Ford...\n");
    bellmanFord(graph, h);

    printf("Nilai h untuk reweighting:\n ");
    for (i = 0; i < V; i++)
    {
        printf("h[%d] = %d\n", i, h[i]);
    }

    // Step 2: Reweighting graph
    printf("\nStep 2: Reweighting graf...\n");
    for (u = 0; u < V; u++)
    {
        for (v = 0; v < V; v++)
        {
            if (graph[u][v] != INF && u != v)
            {
                reweighted[u][v] = graph[u][v] + h[u] - h[v];
            }
            else
            {
                reweighted[u][v] = graph[u][v];
            }
        }
    }

    // Step 3: Jalankan Dijkstra untuk setiap node
    printf("\nStep 3: Menjalankan Dijkstra untuk setiap node...\n");
    for (i = 0; i < V; i++)
    {
        printf("  - Dijkstra dari node %d\n", i);
        dijkstra(reweighted, i, dist, parent);

        // Restore jarak asli
        for (j = 0; j < V; j++)
        {
            if (dist[j] != INF)
            {
                allPairsDist[i][j] = dist[j] - h[i] + h[j];
            }
            else
            {
                allPairsDist[i][j] = INF;
            }
            allPairsParent[i][j] = parent[j];
        }
    }

    printf("\nJohnson's Algorithm selesai!\n");
}

// Fungsi untuk print path
void printPath(int parent[], int j, Kecamatan kec[])
{
    if (parent[j] == -1)
    {
        printf("%s", kec[j].nama);
        return;
    }

    printPath(parent, parent[j], kec);
    printf(" -> %s", kec[j].nama);
}

// Fungsi untuk menampilkan matriks all-pairs shortest path
// Fungsi untuk menampilkan matriks all-pairs shortest path
void printAllPairsMatrix(int dist[V][V], Kecamatan kec[])
{
    int i, j;
    char initial[3]; // Buffer untuk menyimpan inisial

    printf("\n========================================\n");
    printf("  MATRIKS ALL-PAIRS SHORTEST PATH\n");
    printf("========================================\n\n");

    // Cetak Header Kolom (Menggunakan Inisial 2 Huruf)
    printf("%-15s", "Dari\\Ke");
    for (j = 0; j < V; j++)
    {
        getInitial(kec, j, initial);
        printf("%-6s", initial); // Menggunakan inisial
    }
    printf("\n");

    // Garis Pemisah
    for (i = 0; i < 15 + 6 * V; i++)
        printf("-");
    printf("\n");

    // Cetak Baris (Header Baris menggunakan nama lengkap, data menggunakan angka)
    for (i = 0; i < V; i++)
    {
        printf("%-15s", kec[i].nama); // Mencetak nama lengkap di header baris
        for (j = 0; j < V; j++)
        {
            if (dist[i][j] == INF)
            {
                printf("%-6s", "INF");
            }
            else
            {
                printf("%-6d", dist[i][j]);
            }
        }
        printf("\n");
    }
}

int main()
{
    Kecamatan kecamatan[V];
    int graph[V][V];
    int allPairsDist[V][V];
    int allPairsParent[V][V];
    int asal, tujuan;
    int i;

    printf("========================================\n");
    printf("  SHORTEST PATH - KECAMATAN YOGYAKARTA\n");
    printf("  Menggunakan Johnson's Algorithm\n");
    printf("========================================\n");

    // Inisialisasi data
    initKecamatan(kecamatan);
    initGraph(graph);

    printf("\nDaftar Kecamatan:\n");
    for (i = 0; i < V; i++)
    {
        printf("%d. %s\n", i, kecamatan[i].nama);
    }

    // Jalankan Johnson's Algorithm
    johnsonAlgorithm(graph, allPairsDist, allPairsParent);

    // Tampilkan matriks
    printAllPairsMatrix(allPairsDist, kecamatan);

    // Input dari user
    printf("\n============================================================\n");
    printf("  PENCARIAN JALUR TERPENDEK 7 KECAMATAN DI YOGYAKARTA\n");
    printf("============================================================\n");
    printf("\nMasukkan kecamatan asal (0-%d): ", V - 1);
    scanf("%d", &asal);
    printf("Masukkan kecamatan tujuan (0-%d): ", V - 1);
    scanf("%d", &tujuan);

    if (asal < 0 || asal >= V || tujuan < 0 || tujuan >= V)
    {
        printf("\nInput tidak valid!\n");
        return 1;
    }

    printf("\n========================================\n");
    printf("  HASIL PENCARIAN\n");
    printf("========================================\n");
    printf("Kecamatan asal  : %s\n", kecamatan[asal].nama);
    printf("Kecamatan tujuan: %s\n", kecamatan[tujuan].nama);
    printf("\nJalur terpendek : ");
    printPath(allPairsParent[asal], tujuan, kecamatan);
    printf("\nTotal jarak     : %d km\n", allPairsDist[asal][tujuan]);
    printf("========================================\n");

    return 0;
}