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
  "tree-1": { label: "Cutting", count: 0, icon: "tree-1" },
  "tree-2": { label: "Plant", count: 0, icon: "tree-2" },
  "tree-3": { label: "Tree", count: 0, icon: "tree-3" },
  signpost: { label: "Signpost", count: 0, icon: "signpost" },
  flower: { label: "Flower", count: 0, icon: "flower" },
  log: { label: "Log", count: 0, icon: "log" },
  bee: { label: "Bee", count: 0, icon: "bee" }, 
  butterfly: {
    label: "Butterfly",
    plural: "Butterflies",
    count: 0,
    icon: "butterfly", 
  },
};

function forestData(data) {
  const treeCounts = JSON.parse(JSON.stringify(noteLabels));
  const canvasTrees = data.collections.note.map((n) => {
    let rawIcon = n.data.noteIcon;
    let height = 2;
    let v;

    if (!isNaN(rawIcon)) {
      height = parseInt(rawIcon);
      v = "tree-" + rawIcon;
    } else if (typeof rawIcon === "string" && rawIcon in noteLabels) {
      v = rawIcon;
    } else {
      v = "tree-1"; // default if no noteIcon declared
    }

    treeCounts[v].count++;
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
