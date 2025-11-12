import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Profile } from './types';
import { profiles as allProfiles } from './data/profiles';
import { generateProfileSummary } from './services/geminiService';
import SearchBar from './components/SearchBar';
import ProfileCard from './components/ProfileCard';
import LoadingSpinner from './components/LoadingSpinner';
import { BotIcon, UserIcon } from './components/Icons';
import Markdown from 'react-markdown';

const FadeInSection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="animate-[fadeIn_0.5s_ease-in-out]">{children}</div>;
};

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedResponse, setGeneratedResponse] = useState<string>('');
  const [retrievedProfiles, setRetrievedProfiles] = useState<Profile[]>([]);
  const [error, setError] = useState<string | null>(null);

  const retrieveRelevantProfiles = (currentQuery: string): Profile[] => {
    if (!currentQuery.trim()) {
      return [];
    }
    const keywords = currentQuery.toLowerCase().split(/\s+/).filter(Boolean);
    const keywordSet = new Set(keywords);

    const scoredProfiles = allProfiles.map(profile => {
      let score = 0;
      const profileText = `${profile.name} ${profile.title} ${profile.skills.join(' ')} ${profile.bio}`.toLowerCase();
      
      keywords.forEach(keyword => {
        if (profileText.includes(keyword)) {
          score++;
        }
      });

      profile.skills.forEach(skill => {
        if(keywordSet.has(skill.toLowerCase())){
            score += 2;
        }
      });

      return { profile, score };
    });

    return scoredProfiles
      .filter(p => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5) // Retrieve top 5 relevant profiles
      .map(p => p.profile);
  };

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery || isLoading) return;

    setIsLoading(true);
    setQuery(searchQuery);
    setError(null);
    setGeneratedResponse('');
    setRetrievedProfiles([]);

    try {
      // 1. Retrieval
      const relevantProfiles = retrieveRelevantProfiles(searchQuery);
      setRetrievedProfiles(relevantProfiles);

      if (relevantProfiles.length === 0) {
        setGeneratedResponse("I couldn't find any profiles that match your query. Please try a different search term.");
        setIsLoading(false);
        return;
      }

      // 2. Augmentation & 3. Generation
      const summary = await generateProfileSummary(searchQuery, relevantProfiles);
      setGeneratedResponse(summary);

    } catch (e) {
      console.error(e);
      setError('An error occurred while fetching the summary. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  return (
    <div className="min-h-screen bg-[#FDF6E3] text-[#5D4037] font-['Inter',_sans-serif] flex flex-col">
       <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <header className="p-4 sticky top-0 z-10 bg-[#FDF6E3]/80 backdrop-blur-sm">
        <div className="container mx-auto max-w-4xl">
            <h1 className="text-2xl font-medium text-[#654321] font-['Roboto_Mono',_monospace]">AI Recruiter</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 max-w-4xl w-full">
        <div className="space-y-8">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          
          {isLoading && <LoadingSpinner />}
          {error && <div className="bg-red-100 border border-red-300 text-red-800 p-4 rounded-lg animate-[fadeIn_0.5s_ease-in-out]">{error}</div>}

          {query && !isLoading && (
            <FadeInSection>
              <div className="p-5 rounded-xl bg-[#F5F0E4] border border-[#E0DACE] flex items-start gap-4">
                <UserIcon className="w-6 h-6 text-[#A67B5B] flex-shrink-0 mt-1" />
                <p className="font-semibold text-[#5D4037] text-lg">{query}</p>
              </div>
            </FadeInSection>
          )}

          {generatedResponse && !isLoading && (
            <FadeInSection>
                <div className="p-5 rounded-xl bg-[#F5F0E4] border border-[#E0DACE] flex items-start gap-4">
                <BotIcon className="w-6 h-6 text-[#A67B5B] flex-shrink-0 mt-1" />
                <div className="prose max-w-none prose-p:text-[#5D4037] prose-headings:text-[#654321] prose-strong:text-[#49322a] prose-a:text-[#A67B5B] hover:prose-a:text-[#8D6E63]">
                    <Markdown>{generatedResponse}</Markdown>
                </div>
                </div>
            </FadeInSection>
          )}

          {retrievedProfiles.length > 0 && !isLoading && (
             <FadeInSection>
                <div className="space-y-4">
                <h2 className="text-xl font-semibold text-[#654321] border-b border-[#E0DACE] pb-2 font-['Roboto_Mono',_monospace]">Retrieved Profiles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {retrievedProfiles.map(profile => (
                    <ProfileCard key={profile.id} profile={profile} />
                    ))}
                </div>
                </div>
            </FadeInSection>
          )}

          {!query && !isLoading && (
             <div className="text-center p-10 bg-gradient-to-br from-[#F5F0E4] to-[#FDF6E3] rounded-xl border border-[#E0DACE]">
              <h2 className="text-2xl font-semibold text-[#654321] mb-2 font-['Roboto_Mono',_monospace]">Find Your Creative Developer</h2>
              <p className="text-[#8D6E63]">
                Describe your ideal candidate, like "Frontend dev who loves creative coding".
              </p>
            </div>
          )}
        </div>
      </main>

      <footer className="text-center p-4 text-sm text-[#A67B5B]">
        Powered by Gemini and React
      </footer>
    </div>
  );
};

export default App;