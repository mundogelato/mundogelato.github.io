import { useEffect, useState } from 'react';
import { Instagram, ArrowRight, Loader2, AlertCircle, Settings } from 'lucide-react';

interface FeedPost {
  id: string;
  type: 'image' | 'video' | 'carousel';
  image: string;
  permalink: string;
  caption: string;
  timestamp: string;
}

interface FeedResponse {
  configured: boolean;
  posts: FeedPost[];
  error?: string;
}

interface InstagramFeedProps {
  instagramLink: string;
}

export function InstagramFeed({ instagramLink }: InstagramFeedProps) {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'not-configured' | 'error'>('loading');

  useEffect(() => {
    const controller = new AbortController();
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

    if (!supabaseUrl || !supabaseAnonKey) {
      setStatus('not-configured');
      return () => controller.abort();
    }

    const apiUrl = `${supabaseUrl}/functions/v1/instagram-feed`;
    const headers: Record<string, string> = {
      Authorization: `Bearer ${supabaseAnonKey}`,
    };

    fetch(apiUrl, { headers, signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<FeedResponse>;
      })
      .then((data) => {
        if (!data.configured) {
          setStatus('not-configured');
          return;
        }
        if (data.error === 'instagram_api_error') {
          setStatus('error');
          return;
        }
        if (data.posts.length === 0) {
          setStatus('not-configured');
          return;
        }
        setPosts(data.posts);
        setStatus('ready');
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setStatus('error');
      });

    return () => controller.abort();
  }, []);

  if (status === 'loading') {
    return (
      <div className="instagram-status">
        <Loader2 className="instagram-status-icon" size={28} />
        <p>Cargando publicaciones…</p>
      </div>
    );
  }

  if (status === 'not-configured') {
    return (
      <div className="instagram-status">
        <Settings className="instagram-status-icon" size={28} />
        <p>Pronto mostraremos aquí las últimas publicaciones de @mundo_gelato.</p>
        <a className="button button--primary" href={instagramLink} target="_blank" rel="noreferrer">
          <Instagram size={17} /> Visitar Instagram <ArrowRight size={17} />
        </a>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="instagram-status">
        <AlertCircle className="instagram-status-icon" size={28} />
        <p>No pudimos cargar las publicaciones en este momento.</p>
        <a className="button button--primary" href={instagramLink} target="_blank" rel="noreferrer">
          <Instagram size={17} /> Visitar Instagram <ArrowRight size={17} />
        </a>
      </div>
    );
  }

  return (
    <>
      <div className="instagram-grid">
        {posts.map((post) => (
          <a
            key={post.id}
            className="instagram-tile"
            href={post.permalink}
            target="_blank"
            rel="noreferrer"
            aria-label="Ver publicación en Instagram"
          >
            <img src={post.image} alt="Publicación de Mundo Gelato en Instagram" loading="lazy" />
            <Instagram className="instagram-tile-icon" size={20} />
          </a>
        ))}
      </div>
      <div className="instagram-more">
        <a className="button button--primary" href={instagramLink} target="_blank" rel="noreferrer">
          Ver más en Instagram <ArrowRight size={17} />
        </a>
      </div>
    </>
  );
}
