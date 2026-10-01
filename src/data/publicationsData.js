// Paper links are only added once verified (DOI via PubMed, IEEE Xplore record).
export const publications = [
  {
    id: 'murs-2026',
    brief: 'Sole author. Artist gender bias in ALS recommendation on Last.fm 360K; stacked post-processing + Fair-ALS cut male-artist exposure 69.8% to ~50% at 30% lower NDCG cost than post-processing alone.',
    title: 'Amplified Silence: Uncovering and Mitigating Gender Bias in Music Recommendation Algorithms',
    authors: 'Dhyey Desai',
    venue: '4th Music Recommender Systems Workshop (MuRS 2026), held with RecSys',
    year: '2026',
    status: 'Accepted and presented at the 4th Music Recommender Systems Workshop (MuRS 2026), held with RecSys, Sept 28, 2026',
    statusKind: 'accepted',
    summary:
      'Measures artist gender bias in ALS collaborative filtering on Last.fm 360K (24,509 users, 10,362 artists, 3,867 gender-labeled via MusicBrainz) and compares three mitigations: a post-processing boost, Fair-ALS, and the two stacked. The baseline gives 69.8% of position-weighted exposure to male artists; the stacked approach brings this to about 50% (49.97%) while cutting the NDCG cost by 30% compared with post-processing alone.',
    links: [{ label: 'MuRS 2026 workshop', url: 'https://sites.google.com/view/murs-2026/call-for-papers' }],
  },
  {
    id: 'ms-resunet',
    brief: 'First author. ResNet50-encoder 2D U-Net, pseudo-RGB stack of 3 FLAIR slices; Dice 0.714, AUC 0.963 on MSLesSeg2024.',
    title: 'Pseudo-RGB Slice Stacking in 2D ResUNet for High-Sensitivity Multiple Sclerosis Lesion Segmentation',
    authors: 'Dhyey Desai, Jayesh Gangrade, Shweta Gangrade, Atef Gharbi, Yassine Daadaa, Dhouha Ben Noureddine',
    venue: 'Diagnostics (MDPI), 16(16):2494',
    year: '2026',
    status: 'Published',
    statusKind: 'published',
    summary:
      'A 2D U-Net with a ResNet50 encoder that stacks three consecutive FLAIR slices as a pseudo-RGB input. On the MSLesSeg2024 test set it reached Dice 0.714, IoU 0.657, and AUC 0.963, with Dice statistically comparable to a 3D nnU-Net baseline and the lowest false-negative rate of all ablations.',
    links: [{ label: 'Paper (DOI)', url: 'https://doi.org/10.3390/diagnostics16162494' }],
  },
  {
    id: 'brain-stroke',
    brief: 'Compared ML models; logistic regression reached 97% accuracy.',
    title: 'Supervised Machine Learning Approaches for Brain Stroke Detection',
    authors: 'Dhyey V. Desai, Tarun Jain, Priyesh Tiwari',
    venue: 'IEEE IEMECON 2023',
    year: '2023',
    status: 'Published',
    statusKind: 'published',
    summary: 'Compares machine-learning models for brain-stroke detection; logistic regression reached 97% accuracy among the models compared.',
    links: [
      { label: 'Paper (IEEE Xplore)', url: 'https://ieeexplore.ieee.org/abstract/document/10092374' },
      { label: 'Code', url: 'https://github.com/DHYEY166/brainstroke_detection' },
    ],
  },
];
