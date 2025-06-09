import { FaFacebookF, FaGoogle, FaLinkedin } from 'react-icons/fa';

const socialIcons = [FaFacebookF, FaGoogle, FaLinkedin];

const SocialLoginIcons = () => (
  <div className='flex justify-center my-2'>
    {socialIcons.map((Icon, index) => (
      <a
        key={index}
        href='#'
        className='border-2 border-gray-200 rounded-full p-3 mx-1 hover:bg-gray-100 hover:border-primary transition-all'
      >
        <Icon className='text-sm' />
      </a>
    ))}
  </div>
);

export default SocialLoginIcons;
