export default function LoadingPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div
          className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
          style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }}
        />
        <p
          className="text-sm"
          style={{ color: 'var(--text-secondary)' }}
        >
          加载中...
        </p>
      </div>
    </div>
  );
}
