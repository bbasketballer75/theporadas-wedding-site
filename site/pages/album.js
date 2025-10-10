import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import Footer from '../components/Footer';
import Navigation from '../components/Navigation';
import PageTransition from '../components/PageTransition';
import { fetchCanvaTemplates, generateAlbumLayout, isCanvaAvailable } from '../utils/canvaService';

export default function AlbumGeneratorPage() {
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [albumTemplates, setAlbumTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [captions, setCaptions] = useState({});
  const [generating, setGenerating] = useState(false);
  const [generatedAlbum, setGeneratedAlbum] = useState(null);
  const [canvaAvailable, setCanvaAvailable] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const initializeCanva = async () => {
      const available = await isCanvaAvailable();
      setCanvaAvailable(available);

      if (available) {
        const templates = await fetchCanvaTemplates('album');
        setAlbumTemplates(templates);
        if (templates.length > 0) {
          setSelectedTemplate(templates[0].id);
        }
      }
    };

    initializeCanva();
  }, []);

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        alert('Please select only image files');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedPhotos((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            dataUrl: e.target.result,
            name: file.name,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (photoId) => {
    setSelectedPhotos((prev) => prev.filter((p) => p.id !== photoId));
    setCaptions((prev) => {
      const newCaptions = { ...prev };
      delete newCaptions[photoId];
      return newCaptions;
    });
  };

  const updateCaption = (photoId, caption) => {
    setCaptions((prev) => ({ ...prev, [photoId]: caption }));
  };

  const generateAlbum = async () => {
    if (selectedPhotos.length === 0) {
      alert('Please select at least one photo');
      return;
    }

    if (!selectedTemplate) {
      alert('Please select a template');
      return;
    }

    setGenerating(true);
    setError('');

    try {
      const photos = selectedPhotos.map((p) => p.dataUrl);
      const captionArray = selectedPhotos.map((p) => captions[p.id] || '');

      const album = await generateAlbumLayout({
        templateId: selectedTemplate,
        photos,
        captions: captionArray,
      });

      setGeneratedAlbum(album);
    } catch (err) {
      console.error('Album generation error:', err);
      setError('Failed to generate album. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const downloadAlbumPDF = () => {
    if (!generatedAlbum || !generatedAlbum.pdfUrl) return;

    const link = document.createElement('a');
    link.href = generatedAlbum.pdfUrl;
    link.download = `porada-wedding-album-${Date.now()}.pdf`;
    link.click();
  };

  const resetAlbum = () => {
    setSelectedPhotos([]);
    setCaptions({});
    setGeneratedAlbum(null);
    setError('');
  };

  return (
    <PageTransition>
      <Head>
        <title>Album Generator | Austin & Jordyn</title>
        <meta
          name="description"
          content="Create a beautiful wedding album with our auto-layout generator"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-cream via-mint to-blush/20">
        <Navigation />

        <main className="container mx-auto px-4 py-12 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-display text-sage mb-4">Album Generator 📖</h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Transform your wedding photos into a beautiful, print-ready album
            </p>
            {canvaAvailable && (
              <div className="mt-4 inline-flex items-center gap-2 bg-sage/10 px-4 py-2 rounded-full text-sm text-sage font-semibold">
                <span>✨</span>
                <span>Powered by Canva Design Templates</span>
              </div>
            )}
          </div>

          {!canvaAvailable ? (
            /* Canva Not Available */
            <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-8 text-center">
              <div className="text-6xl mb-4">🎨</div>
              <h2 className="text-3xl font-display text-sage mb-4">
                Canva Authentication Required
              </h2>
              <p className="text-gray-700 mb-6">
                To use the Album Generator, you need to authenticate with Canva first.
              </p>
              <div className="bg-blush/10 rounded-xl p-6 text-left">
                <h3 className="font-semibold text-sage mb-3">How to authenticate:</h3>
                <ol className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-2">1.</span>
                    <span>Open Chat in Agent Mode (Ctrl+Alt+I)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">2.</span>
                    <span>Ask: &quot;Show me my Canva designs&quot;</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">3.</span>
                    <span>Click &quot;Allow&quot; and login to your Canva account</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">4.</span>
                    <span>Return here and refresh the page</span>
                  </li>
                </ol>
              </div>
            </div>
          ) : generatedAlbum ? (
            /* Generated Album View */
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
                <h2 className="text-3xl font-display text-sage mb-6 text-center">
                  🎉 Your Album is Ready!
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {generatedAlbum.pages.map((page) => (
                    <div key={page.pageNumber} className="relative aspect-[3/4]">
                      <Image
                        src={page.imageUrl}
                        alt={`Album page ${page.pageNumber}`}
                        width={960}
                        height={1280}
                        className="h-full w-full rounded-xl object-cover shadow-lg"
                        sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 30vw, (min-width: 768px) 40vw, 80vw"
                        unoptimized
                      />
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        Page {page.pageNumber}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={downloadAlbumPDF}
                    className="px-8 py-4 bg-gradient-sage-blush text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    📥 Download PDF
                  </button>
                  <button
                    onClick={resetAlbum}
                    className="px-8 py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                  >
                    🔄 Create New Album
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Album Creation Interface */
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Photo Selection */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-3xl shadow-2xl p-8">
                  <h2 className="text-2xl font-display text-sage mb-6">Select Photos 📷</h2>

                  {/* Upload Button */}
                  <div className="mb-6">
                    <label className="block">
                      <span className="sr-only">Choose photos to upload</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        disabled={generating}
                      />
                      <div className="cursor-pointer border-3 border-dashed border-sage/30 rounded-2xl p-8 text-center hover:border-sage/50 hover:bg-sage/5 transition-colors">
                        <div className="text-5xl mb-3">📤</div>
                        <div className="font-semibold text-sage mb-2">Click to upload photos</div>
                        <div className="text-sm text-gray-600">
                          Select multiple photos to add to your album
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Selected Photos Grid */}
                  {selectedPhotos.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-700">
                          Selected Photos ({selectedPhotos.length})
                        </h3>
                        <button
                          onClick={() => {
                            setSelectedPhotos([]);
                            setCaptions({});
                          }}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Clear All
                        </button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedPhotos.map((photo) => (
                          <div key={photo.id} className="relative group">
                            <div className="relative h-32 w-full overflow-hidden rounded-lg">
                              <Image
                                src={photo.dataUrl}
                                alt={photo.name}
                                fill
                                className="object-cover"
                                sizes="(min-width: 1024px) 200px, (min-width: 768px) 33vw, 50vw"
                                unoptimized
                              />
                            </div>
                            <button
                              onClick={() => removePhoto(photo.id)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                            <input
                              type="text"
                              placeholder="Add caption..."
                              value={captions[photo.id] || ''}
                              onChange={(e) => updateCaption(photo.id, e.target.value)}
                              className="mt-2 w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-sage"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-xl text-center">
                      {error}
                    </div>
                  )}
                </div>
              </div>

              {/* Template Selection & Generate */}
              <div className="space-y-6">
                <div className="bg-white rounded-3xl shadow-2xl p-6">
                  <h2 className="text-2xl font-display text-sage mb-4">Templates 🎨</h2>
                  <div className="space-y-3">
                    {albumTemplates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        disabled={generating}
                        className={`w-full px-4 py-3 rounded-xl font-semibold transition-all duration-300 text-left ${
                          selectedTemplate === template.id
                            ? 'bg-gradient-sage-blush text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } disabled:opacity-50`}
                      >
                        <div className="font-semibold">{template.name}</div>
                        <div className="text-xs opacity-75 mt-1">{template.description}</div>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={generateAlbum}
                    disabled={generating || selectedPhotos.length === 0 || !selectedTemplate}
                    className="w-full mt-6 px-6 py-4 bg-gradient-sage-blush text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {generating ? '⏳ Generating Album...' : '✨ Generate Album'}
                  </button>
                </div>

                {/* Info Box */}
                <div className="bg-gradient-to-br from-sage/10 to-blush/10 rounded-2xl p-6 backdrop-blur">
                  <h3 className="font-display text-lg text-sage mb-3">How it works:</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start">
                      <span className="mr-2">1️⃣</span>
                      <span>Upload your favorite wedding photos</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">2️⃣</span>
                      <span>Add optional captions to each photo</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">3️⃣</span>
                      <span>Choose an album layout template</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">4️⃣</span>
                      <span>Generate and download your album as PDF</span>
                    </li>
                  </ul>
                </div>

                {/* Stats */}
                <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
                  <div className="text-3xl mb-2">📊</div>
                  <div className="text-2xl font-display text-sage mb-1">
                    {selectedPhotos.length}
                  </div>
                  <div className="text-sm text-gray-600">Photos Selected</div>
                </div>
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}
