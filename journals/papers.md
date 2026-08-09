## Statement of Purpose
learning is hard. there's the whole "research vs industry" debacle and i personally don't think the current research landscape is well optimized for genuine innovation (e.g carbon removal research is important yet very underfunded). but i digress. this is here to lower the bar of entry for myself for reading papers i find interesting but have been putting off. 

## TokUR: Token-level Uncertainty Estimation for Large Language Model Reasoning

summary: new framework to evaluate token uncertainty by low-rank weight perturbation. key element is that its training-free, making it a cheap way to evaluate how confident an llm is on certain parts of its answer. 

two parts of when the paper tries to quantify randomness: aleatoric uncertainty which is data being random and epistemic uncertainty which is model being unsure. 

this works off of Bayesian LLMs, but applications of llms can be optimized for fields where it may not be directly intuitive (e.g medical imaging data) by adapting token uncertainty into some sort of vision transformer.

$$\begin{equation}
p(y \mid x) = \int p(y \mid x; \theta)\, q(\theta \mid D)\, d\theta
\approx \frac{1}{M} \sum_{m=1}^{M} p(y \mid x; \theta^{(m)})
\end{equation}$$

$p(y|x)$ is the probability producing y from input x (the confidence of a prediction y). note: theta is missing here due to the integration already
accounting for uncertainty
the integral of $p(y|x;\theta)q(\theta|D)$ with $d\theta$. $q(\theta|D)$ is our approximation of true weight posterior $p(\theta|D)$. if you are unfamiliar with what a true weight posterior is, it just means the ideal and exact probability distribution of weights.

to be continued

## The Story of RNA Folding, as Told in Epochs

tldr: review of rna folding field, rna acts as its catalyst (RNA world) -> proteins enhance functionality -> 

to be continued