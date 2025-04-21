from sklearn.cluster import KMeans
import pandas as pd
import numpy as np

example_of_points = [
    {
      "coords": {
        "lat": -7.289842470802628,
        "lng": 112.75646209716798
      },
      "label": "joy",
      "score": 0.3637967109680176
    }
  ]

def cluster_points(points, n):
    if not points:
        return []

    coords = np.array([[point["coords"]["lat"], point["coords"]["lng"]] for point in points])
    labels = [point["label"] for point in points]

    kmeans = KMeans(n_clusters=n, init='k-means++', random_state=0).fit(coords)
    clusters = kmeans.labels_

    df = pd.DataFrame(coords, columns=["lat", "lng"])
    df["label"] = labels
    df["cluster"] = clusters

    cluster_centers = kmeans.cluster_centers_

    result = []
    for cluster_id in range(len(cluster_centers)):
        cluster_points = df[df["cluster"] == cluster_id]
        points = cluster_points.to_dict(orient="records")
        mode_series = cluster_points["label"].mode()
        mode = mode_series.iloc[0] if not mode_series.empty else None

        result.append({
            "cluster": cluster_id,
            "center": {
                "lat": cluster_centers[cluster_id][0],
                "lng": cluster_centers[cluster_id][1]
            },
            "points": points,
            "mode": mode
        })

    return result

