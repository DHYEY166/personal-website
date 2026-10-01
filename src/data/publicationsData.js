// No DOIs or paper URLs are listed on purpose: only links that are known to exist.
export const publications = [
  {
    id: 'murs-2026',
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
    title: 'Pseudo-RGB slice stacking in a 2D ResUNet for high-sensitivity multiple sclerosis lesion segmentation',
    venue: 'Diagnostics (MDPI)',
    status: 'Published',
    statusKind: 'published',
    links: [{ label: 'Code', url: 'https://github.com/DHYEY166/Multiple_Sclerosis_Detection' }],
  },
  {
    id: 'brain-stroke',
    title: 'Brain Stroke Detection using ML Models',
    venue: 'IEEE (IEEE Xplore)',
    status: 'Published',
    statusKind: 'published',
    summary: 'Compares machine-learning models for brain-stroke detection; logistic regression reached 96% accuracy among the models compared.',
    links: [{ label: 'Code', url: 'https://github.com/DHYEY166/brainstroke_detection' }],
  },
];
