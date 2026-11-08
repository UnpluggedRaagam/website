import { DemoOne } from '@/components/ui/demo';

export default function App() {
  return (
    <div className="min-h-screen bg-[#faf3ed] py-8">
      <p className="text-center text-sm text-[#5c2a2a]/70 mb-4 px-4">
        Dev preview — same block mounts on <code className="text-[#a35f4d]">#cafes-root</code> in{' '}
        <code>index.html</code>
      </p>
      <DemoOne />
    </div>
  );
}
