import React from 'react'
import type { FeedbackType } from '../../utils/customer/constants';
import { Quote } from 'lucide-react';

export function CustomerFeedback({
    FEEDBACK_LIST, styles
}: {
    FEEDBACK_LIST: FeedbackType[];
    styles?: string;
}) {
    return (
        <>
            <section className='border-0  mb-3 relative xl:pt-1 pb-8 xl:px-32   lg:px-8 md:px-4 sm:px-2 py-1'>
                <h2 className="text-2xl text-center font-bold mt-8 mb-6 border-0  ">Customer Feedback</h2>
                <img src={''} alt="" className='  w-full h-full object-cover bg-white border-0 mb-6 absolute z-[-10] top-0 left-0' />
                <div className=' flex flex-wrap justify-center gap-8 p-4 rounded-lg'>
                    {FEEDBACK_LIST.map((feedback, index) => (
                        <div key={index} className={`feedback-item bg-card text-card-foreground  border-2 p-8 rounded-3xl w-102 ${styles}`}>
                            <Quote className='rotate-180 mb-6' fill='black' />
                            <p className="feedback-comment">{feedback.feedback
                            }</p>
                            <p className="feedback-name">- {feedback.customerName}</p>
                        </div>
                    ))}
                </div>
            </section>
        </>
    )
}
