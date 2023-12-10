import { Button } from "@/components/ui/button"

export default function Chat() {
  return (
    <div>
      <div className="mx-auto bg-gray-100 p-1 md:w-full">
        <div className="flex flex-wrap items-start">
          <div className="p-2 w-full">
            <div className="uppercase tracking-wide text-sm text-gray-700 font-semibold">User 1</div>
            <p className="mt-2 text-gray-600">
              Hello! How are you today? I hope you are doing well. It's such a beautiful day outside and I can't wait to
              go for a run later. I've been training for a marathon and it's been such a rewarding experience.
            </p>
          </div>
        </div>
      </div>
      <div className="mx-auto bg-gray-200 p-1 md:w-full">
        <div className="flex flex-wrap items-start">
          <div className="p-2 w-full">
            <div className="uppercase tracking-wide text-sm text-gray-700 font-semibold">User 2</div>
            <p className="mt-2 text-gray-600">
              I am fine, thank you! And you? I've been quite busy with work lately but it's all good. I love what I do
              and I'm grateful for the opportunities that come my way. How about you? How's everything going?
            </p>
          </div>
        </div>
      </div>
      <div className="mx-auto bg-gray-100 p-1 md:w-full">
        <div className="flex flex-wrap items-start">
          <div className="p-2 w-full">
            <div className="uppercase tracking-wide text-sm text-gray-700 font-semibold">User 1</div>
            <p className="mt-2 text-gray-600">
              I am doing great, thank you for asking! I've been really into reading lately and I've discovered so many
              amazing books. Right now, I'm reading a fascinating book about the history of technology. It's really
              eye-opening.
            </p>
          </div>
        </div>
      </div>
      <div className="mx-auto bg-gray-200 p-1 md:w-full">
        <div className="flex flex-wrap items-start">
          <div className="p-2 w-full">
            <div className="uppercase tracking-wide text-sm text-gray-700 font-semibold">User 2</div>
            <p className="mt-2 text-gray-600">
              This message is short
            </p>
          </div>
        </div>
      </div>
      <div className="mx-auto bg-gray-300 p-1 md:w-full">
        <div className="flex justify-between items-center">
          <input
            aria-label="Type your message here"
            className="w-full px-3 py-2 text-gray-700 focus:outline-none bg-gray-300"
            placeholder="Type your message here..."
            type="text"
          />
          <Button aria-label="Send Message" className="w-1/4 text-center rounded-lg bg-gray-500 text-white hidden">
            Send Message
          </Button>
        </div>
      </div>
    </div>
  )
}
