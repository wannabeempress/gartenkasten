function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

function sliceIntoChunks(arr, chunkSize) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}

function getPositions(trees) {
  let minInRow = Math.floor(Math.sqrt(trees.length));
  let maxInRow = Math.ceil(Math.sqrt(trees.length));
  if (minInRow < maxInRow) {
    trees = trees.concat(
      Array(Math.pow(maxInRow, 2) - trees.length).fill([0, "", ""])
    );
  }
  trees = shuffle([...trees]);
  let levels = sliceIntoChunks(trees, maxInRow);
  return levels;
}

const noteLabels = {
  seed: { label: "Seed", plural: "Seeds", icon: "🌱", count: 0 },
  spark: { label: "Spark", plural: "Sparks", icon: "✨", count: 0 },
  cutting: { label: "Cutting", plural: "Cuttings", icon: "🍃", count: 0 },
  plant: { label: "Plant", plural: "Plants", icon: "🌿", count: 0 },
  butterfly: { label: "Butterfly", plural: "Butterflies", icon: "🦋", count: 0 },
  log: { label: "Log", plural: "Logs", icon: "🪵", count: 0 },
  signpost: { label: "Signpost", plural: "Signposts", icon: "🚩", count: 0 },
};

function forestData(data) {
  const treeCounts = JSON.parse(JSON.stringify(noteLabels));
  const canvasTrees = data.collections.note.map((n) => {
    let v = parseInt(n.data.noteIcon);
    let height = 2;
    if (!v) {
      v = n.data.noteIcon;
    } else {
      height = v;
      v = `tree-${v}`;
    }
    if (treeCounts[v]) {
      treeCounts[v].count++;
    } else {
      treeCounts[v] = {
      label: v,
      plural: v,
      count: 1,
      icon: v,
    };
}
    return [v, n.url, n.data.title || n.fileSlug, height];
  });

  let legends = Object.values(treeCounts).filter((c) => c.count > 0);
  legends.sort((a, b) => b.count - a.count);
  return {
    trees: getPositions(canvasTrees),
    legends,
  };
}

function userComputed(data) {
  return {
    forest: forestData(data),
  };
}

exports.userComputed = userComputed;
